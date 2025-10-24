//sending messages(response) back to the user 
import twilio from 'twilio';
import 'dotenv/config';


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Sends an SMS message to a user.
 * @param {string} to The recipient's phone number.
 * @param {string} body The message text to send.
 */
export const sendMessage = async (to, body) => {
    try {
        await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: to
        });
        console.log(`Message sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending message to ${to}:`, error);
    }
};
