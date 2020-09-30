"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallback = void 0;
exports.fallback = (agent) => {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
};
