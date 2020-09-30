"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const express_1 = __importDefault(require("express"));
const intentHandler_1 = require("./intents/intentHandler");
const app = express_1.default();
app.get('/', (request, response, next) => {
    response.send('Online');
});
app.post('/dialogflow', express_1.default.json(), (request, response) => {
    const agent = new dialogflow_fulfillment_1.WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    return intentHandler_1.intentHandler(agent);
});
module.exports = app;
