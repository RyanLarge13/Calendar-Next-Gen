import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

// Read the HTML template file

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const welcomeEmailTemplatePath = path.join(
  __dirname,
  "emailTemplates/welcome.html"
);
const welcomeEmailTemplate = await fs.readFile(
  welcomeEmailTemplatePath,
  "utf-8"
);

// Create a transporter using async/await
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "calendarnextgen@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //refreshToken: YOUR_REFRESH_TOKEN,
    // accessToken: YOUR_ACCESS_TOKEN,
  },
});

// Compose the email
export const sendWelcomeEmail = async (recipientEmail, username, password) => {
  const customizedWelcomeEmailContent = emailTemplate
    .replace("{username}", username)
    .replace("{password}", password);
  const mailOptions = {
    from: "calendarnextgen@gmail.com",
    to: recipientEmail,
    subject: "Welcome To CNG",
    html: customizedWelcomeEmailContent,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
