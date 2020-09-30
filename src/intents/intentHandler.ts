import { WebhookClient } from "dialogflow-fulfillment";

import {fallback} from './fallback'
import {testWebhook} from './testWebhook'
import {welcome} from './welcome'

export const intentHandler = (agent: WebhookClient) => {
  const intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);

  // this is a sample intent - create an intent called 'Test Webhook' in your bot to see the response
  intentMap.set('Test Webhook', testWebhook)
  return agent.handleRequest(intentMap)
}