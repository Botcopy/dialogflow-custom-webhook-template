"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const axios_1 = __importDefault(require("axios"));
const get_1 = __importDefault(require("lodash/get"));
const functions = __importStar(require("firebase-functions"));
const zendeskGetCreds = (botId, email, origin) => __awaiter(void 0, void 0, void 0, function* () {
    functions.logger.log(`zendeskGetCreds ${botId} ${email} ${origin}`);
    try {
        if (botId && email) {
            const result = yield axios_1.default.get(`https://api.botcopy.com/bots/${botId}?isSecure=true`);
            // functions.logger.log('zendeskGetCreds result.data', result.data);
            const zendeskAdminToken = get_1.default(result, "data.integrations.zendeskApiToken", false);
            // functions.logger.log('zendeskGetCreds token', token);
            if (zendeskAdminToken) {
                const zendeskBuff = Buffer.from(`${email}/token:${zendeskAdminToken}`);
                const zendeskBase64 = zendeskBuff.toString("base64");
                const response = {
                    zendeskAdminToken,
                    zendeskEmail: email,
                    zendeskUrl: origin,
                    zendeskBasicAuth: `Basic ${zendeskBase64}`,
                };
                // functions.logger.log('zendeskGetCreds', response);
                return response;
            }
        }
    }
    catch (error) {
        functions.logger.error("zendeskGetCreds error", error);
    }
    // fallback as admin
    functions.logger.log("zendeskGetCreds fallback as admin");
    const zendeskEmail = "ADMIN - EMAIL - HERE";
    const zendeskToken = "ADMIN - API - TOKEN - HERE";
    const zendeskBuff = Buffer.from(`${zendeskEmail}/token:${zendeskToken}`);
    const zendeskBase64 = zendeskBuff.toString("base64");
    return {
        zendeskEmail,
        zendeskUrl: "ZENDESK - URL - HERE",
        zendeskBasicAuth: `Basic ${zendeskBase64}`,
    };
});
exports.default = zendeskGetCreds;
