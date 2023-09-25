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
  "../emailTemplates/welcome.html"
);
const welcomeEmailTemplate = await fs.readFile(
  welcomeEmailTemplatePath,
  "utf-8"
);

// Create a transporter using async/await
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "calendarnextgen@gmail.com", // Your Gmail address
    pass: process.env.GOOGLE_APP_PASS,
  },
});

// Compose the email
export const sendWelcomeEmail = async (recipientEmail, username, password) => {
  const customizedWelcomeEmailContent = welcomeEmailTemplate
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
  } catch (error) {
    console.error(error);
  }
};
