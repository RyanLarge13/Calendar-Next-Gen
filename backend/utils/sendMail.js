import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Welcome email template
const welcomeEmailTemplatePath = path.join(
  __dirname,
  "../emailTemplates/welcome.html"
);
const welcomeEmailTemplate = await fs.readFile(
  welcomeEmailTemplatePath,
  "utf-8"
);

// Welcome social email template
const welcomeSocialEmailTemplatePath = path.join(
  __dirname,
  "../emailTemplates/socialLoginWelcomeEmail.html"
);
const welcomeSocialEmailTemplate = await fs.readFile(
  welcomeSocialEmailTemplatePath,
  "utf-8"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "calendarnextgen@gmail.com",
    pass: process.env.GOOGLE_APP_PASS,
  },
});

// Compose welcome email
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

// Compose social login welcome email
export const sendSocialWelcomeEmail = async (
  recipientEmail,
  username,
  platform
) => {
  const customizedWelcomeEmailContent = welcomeSocialEmailTemplate
    .replace("{username}", username)
    .replace("{email}", email)
    .replace("{socialPlatform}", platform);
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
