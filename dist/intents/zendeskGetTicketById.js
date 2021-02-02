"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zendeskGetTicketById = void 0;
const actions_on_google_1 = require("actions-on-google");
const axios_1 = __importDefault(require("axios"));
const lodash_1 = require("lodash");
const zendesk_1 = __importDefault(require("../util/zendesk"));
exports.zendeskGetTicketById = (agent) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    agent.requestSource = "ACTIONS_ON_GOOGLE";
    const conv = agent.conv();
    // Get Zendesk Creds
    const session = agent.getContext("botcopy-botid");
    console.log("session", session);
    const botId = lodash_1.get(session, "parameters.botId", null);
    const zendeskEmail = lodash_1.get(agent.getContext("botcopy-zendesk"), "parameters.zendeskEmail", null);
    const zendeskParams = yield zendesk_1.default(botId, zendeskEmail, lodash_1.get(session, "parameters.origin", null));
    const zendeskUrl = lodash_1.get(zendeskParams, "zendeskUrl", false);
    const zendeskBasicAuth = lodash_1.get(zendeskParams, "zendeskBasicAuth", false);
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
            const res = yield axios_1.default.get(
            // `${zendeskUrl}/api/v2/search.json?query=${ticketId}`,
            `${zendeskUrl}/api/v2/requests/search.json?query=${ticketId}`, {
                headers: {
                    Authorization: zendeskBasicAuth,
                },
            });
            const { data } = res;
            // zendesk will return an array of tickets
            // since we are searching by id, it should just be one
            const tickets = data.requests;
            // there will only be one ticket if they are searching by id
            if (tickets.length) {
                const ticket = tickets[0];
                const { id, created_at, updated_at, type, subject, description, priority, status, } = ticket;
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
                conv.ask(new actions_on_google_1.BasicCard({
                    text,
                    subtitle: `Type: ${type} | Priority: ${priority} | Status: ${status}`,
                    title: `#${id} - ${subject}`,
                }));
                conv.ask("Would you like to view or add comments?");
                conv.ask(new actions_on_google_1.Suggestions(["View ticket comments", "Add a comment"]));
            }
            else {
                conv.ask("We couldn't find a ticket with that ID. Please enter another one.");
            }
        }
        catch (e) {
            console.log("zendeskGetTicketById error >", e);
            conv.ask("Sorry, there was an error fetching that ticket. Please try again");
        }
    }
    else {
        conv.ask("Sorry, there was an error fetching the comment or ticket ID. Please try again.");
    }
    return agent.add(conv);
});
