import {WebhookClient} from 'dialogflow-fulfillment'

export const testWebhook = (agent: WebhookClient) => {
  agent.add("Webhook is online!")
}