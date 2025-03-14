import axios from "axios";
import dotenv from 'dotenv'

dotenv.config();

const TERMII_BASE_URL = process.env.TERMII_BASE_URL;
const TERMII_API_KEY = process.env.TERMII_APIKEY; // Replace with your actual API key

export const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(TERMII_BASE_URL, {
      to: phone,
      from: "N-Alert", // Change this to your preferred sender name
      sms: message,
      type: "plain",
      channel: "generic",
      api_key: TERMII_API_KEY,
    });

    console.log("SMS Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    throw new Error("Failed to send SMS");
  }
};
