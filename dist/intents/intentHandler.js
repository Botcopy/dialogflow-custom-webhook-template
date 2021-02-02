"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intentHandler = void 0;
const fallback_1 = require("./fallback");
const testWebhook_1 = require("./testWebhook");
const welcome_1 = require("./welcome");
exports.intentHandler = (agent) => {
    const intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome_1.welcome);
    intentMap.set('Default Fallback Intent', fallback_1.fallback);
    // this is a sample intent - create an intent called 'Test Webhook' in your bot to see the response
    intentMap.set('Test Webhook', testWebhook_1.testWebhook);
    return agent.handleRequest(intentMap);
};
