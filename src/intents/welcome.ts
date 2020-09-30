import {WebhookClient} from 'dialogflow-fulfillment'

export const welcome = (agent: WebhookClient) => {
  agent.add(`Welcome to my agent!`);
}