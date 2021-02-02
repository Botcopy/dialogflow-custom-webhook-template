import axios from "axios";
import get from "lodash/get";
import * as functions from "firebase-functions";
const zendeskGetCreds = async (
  botId: string,
  email?: string,
  origin?: string
) => {
  functions.logger.log(`zendeskGetCreds ${botId} ${email} ${origin}`);
  try {
    if (botId && email) {
      const result = await axios.get(
        `https://api.botcopy.com/bots/${botId}?isSecure=true`
      );
      // functions.logger.log('zendeskGetCreds result.data', result.data);
      const zendeskAdminToken = get(
        result,
        "data.integrations.zendeskApiToken",
        false
      );
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
  } catch (error) {
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
};
export default zendeskGetCreds;
