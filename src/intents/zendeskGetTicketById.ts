import { BasicCard, Suggestions } from "actions-on-google";
import { WebhookClient } from "dialogflow-fulfillment";
import axios from "axios";
import { get } from "lodash";
import zendeskGetCreds from "../util/zendesk";

export const zendeskGetTicketById = async (agent: WebhookClient) => {
  // @ts-ignore
  agent.requestSource = "ACTIONS_ON_GOOGLE";
  const conv = agent.conv();
  // Get Zendesk Creds
  const session: any = agent.getContext("botcopy-botid");
  console.log("session", session);
  const botId = get(session, "parameters.botId", null);
  const zendeskEmail = get(
    agent.getContext("botcopy-zendesk"),
    "parameters.zendeskEmail",
    null
  );
  const zendeskParams = await zendeskGetCreds(
    botId,
    zendeskEmail,
    get(session, "parameters.origin", null)
  );
  const zendeskUrl = get(zendeskParams, "zendeskUrl", false);
  const zendeskBasicAuth = get(zendeskParams, "zendeskBasicAuth", false);
  // get the ticket id from the previous message
  const { ticketId } = agent.parameters;
  // create a context for later
  agent.setContext({
    name: "zendesk-ticket-context",
    lifespan: 10,
    parameters: {
      ticketId,
    },
  });
  if (ticketId && zendeskUrl && zendeskBasicAuth) {
    try {
      // ping zendesk now that we have the ticket id
      const res = await axios.get(
        // `${zendeskUrl}/api/v2/search.json?query=${ticketId}`,
        `${zendeskUrl}/api/v2/requests/search.json?query=${ticketId}`,
        {
          headers: {
            Authorization: zendeskBasicAuth,
            // NOTE: This API version does not support the X-On-Behalf-Of header.
            // Please use an API token.
            // 'X-On-Behalf-Of': zendeskEmail,
          },
        }
      );
      const { data } = res;
      // zendesk will return an array of tickets
      // since we are searching by id, it should just be one
      const tickets = data.requests;
      // there will only be one ticket if they are searching by id
      if (tickets.length) {
        const ticket = tickets[0];
        const {
          id,
          created_at,
          updated_at,
          type,
          subject,
          description,
          priority,
          status,
        } = ticket;
        // convert the incoming ISO date strings to readable format
        // options configure the date output
        const options = {
          weekday: "short",
          year: "numberic",
          month: "long",
          day: "numeric",
        };
        // use markup to edit the basic card text
        const text = `${description}<br/><br/>Created At: ${created_at}<br/>Last Updated: ${updated_at}`;
        conv.ask(`Here is ticket #${ticketId}:`);
        conv.ask(
          new BasicCard({
            text,
            subtitle: `Type: ${type} | Priority: ${priority} | Status: ${status}`,
            title: `#${id} - ${subject}`,
          })
        );
        conv.ask("Would you like to view or add comments?");
        conv.ask(new Suggestions(["View ticket comments", "Add a comment"]));
      } else {
        conv.ask(
          "We couldn't find a ticket with that ID. Please enter another one."
        );
      }
    } catch (e) {
      console.log("zendeskGetTicketById error >", e);
      conv.ask(
        "Sorry, there was an error fetching that ticket. Please try again"
      );
    }
  } else {
    conv.ask(
      "Sorry, there was an error fetching the comment or ticket ID. Please try again."
    );
  }
  return agent.add(conv);
};
