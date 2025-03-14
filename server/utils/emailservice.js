import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App password (not your real password)
  },
});

// Function to send email
export const sendEmail = async (to, subject, text, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: `"Inventory SaaS" <${process.env.EMAIL_USER}>`, // Sender
        to,
        subject,
        text,
      });

      console.log(`Email sent successfully on attempt ${attempt}:`, info.messageId);
      return; // Exit function if successful
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === retries) {
        console.error("All attempts to send email failed.");
      } else {
        console.log("Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
      }
    }
  }
};

