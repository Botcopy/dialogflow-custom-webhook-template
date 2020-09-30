import { WebhookClient } from 'dialogflow-fulfillment'

export const fallback = (agent: WebhookClient) => {
  agent.add(`I didn't understand`)
  agent.add(`I'm sorry, can you try again?`)
}