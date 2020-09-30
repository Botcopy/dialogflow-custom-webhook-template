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
    intentMap.set('Test Webhook', testWebhook_1.testWebhook);
    return agent.handleRequest(intentMap);
};
