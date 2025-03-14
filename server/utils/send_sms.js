// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio"; // Or, for ESM: import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createMessage(number, body) {
  if (!number || !body) {
    console.log("number and message body and required in this function");
    return;
  }
  const message = await client.messages.create({
    body: body,
    from: "+17372588648",
    to: `${number}`,
  });

  console.log(message.body);
}
