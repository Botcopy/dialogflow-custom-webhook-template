import { WebhookClient } from "dialogflow-fulfillment";

import {fallback} from './fallback'
import {testWebhook} from './testWebhook'
import {welcome} from './welcome'

export const intentHandler = (agent: WebhookClient) => {
  const intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Test Webhook', testWebhook)
  return agent.handleRequest(intentMap)
}