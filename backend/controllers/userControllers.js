import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";
import { getOAuth2Client } from "../utils/helpers.js";
import signToken from "../auth/signToken.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendSocialWelcomeEmail } from "../utils/sendMail.js";
import Axios from "axios";

const prisma = new PrismaClient();

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const fetchUserData = (req, res) => {
  const { username, email, avatarUrl, birthday, id, createAt, notifSub } =
    req.user;
  res.status(200).json({
    message: "Success",
    user: { username, email, avatarUrl, birthday, id, createAt, notifSub },
  });
};

export const loginWithGoogle = async (req, res) => {
  const { id, username, email, avatarUrl } = req.body.user;
  const exsistingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (exsistingUser) {
    await bcrypt.compare(id, exsistingUser.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const newSignture = signToken(exsistingUser);
      res.status(201).json({
        token: newSignture,
        user: {
          username: exsistingUser.username,
          email: exsistingUser.email,
          avatarUrl: exsistingUser.avatarUrl,
          birthday: exsistingUser.birthday,
          id: exsistingUser.id,
          createdAt: exsistingUser.createAt,
          notifSub: exsistingUser.notifSub,
        },
      });
    });
  }
  if (!exsistingUser) {
    const hashedPassword = await hashPassword(id);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      avatarUrl,
    };
    const createdUser = await prisma.user.create({
      data: newUser,
    });
    const newSignture = signToken(createdUser);
    res.status(201).json({
      token: newSignture,
      user: {
        username: createdUser.username,
        email: createdUser.email,
        avatarUrl: createdUser.avatarUrl,
        birthday: createdUser.birthday,
        id: createdUser.id,
        createdAt: createdUser.createAt,
      },
    });
    sendSocialWelcomeEmail(email, username, "Google");
  }
};

export const loginWithFacebook = async (req, res) => {
  const { accessToken } = req.body;
  try {
    const fbResponse = await Axios.get(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const userData = fbResponse.data;
    const hashedPassword = await hashPassword(userData.id);
    const fbUser = {
      username: userData.name,
      email: userData.email,
      password: hashedPassword,
      avatarUrl: userData.picture.url,
    };
    const exsistingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (exsistingUser) {
    }
    if (!exsistingUser) {
    }
    //res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Authentication failed" });
  }
};

export const loginWithPasswordUsername = async (req, res) => {
  const { username, email, password, avatarUrl } = req.body;
  const exsistingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (exsistingUser) {
    await bcrypt.compare(password, exsistingUser.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const newSignture = signToken(exsistingUser);
      res.status(201).json({
        token: newSignture,
        user: {
          username: exsistingUser.username,
          email: exsistingUser.email,
          avatarUrl: exsistingUser.avatarUrl,
          birthday: exsistingUser.birthday,
          id: exsistingUser.id,
          createdAt: exsistingUser.createAt,
          notifSub: exsistingUser.notifSub,
        },
      });
    });
  }
  if (!exsistingUser) {
    const hashedPassword = await hashPassword(password);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      avatarUrl,
    };
    const createdUser = await prisma.user.create({
      data: newUser,
    });
    const newSignture = signToken(createdUser);
    res.status(201).json({
      token: newSignture,
      user: {
        username: createdUser.username,
        email: createdUser.email,
        avatarUrl: createdUser.avatarUrl,
        birthday: createdUser.birthday,
        id: createdUser.id,
        createdAt: createdUser.createAt,
      },
    });
    sendWelcomeEmail(email, username, password);
  }
};

export const fetchGoogleCalendarEvents = async (req, res) => {
  const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [
      "https://www.calng.app",
      "http://localhost:5173",
      "https://calendar-next-gen.vercel.app",
      "https://calendar-next-gen-git-dev-ryanlarge13.vercel.app",
    ],
  };
  const accessToken = req.params.accessToken;
  const calendar = google.calendar({ version: "v3" });
  try {
    const authClient = getOAuth2Client(credentials, accessToken);
    const calendarResponse = await calendar.events.list({
      auth: authClient,
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 1000,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = calendarResponse.data.items;
    res
      .status(200)
      .json({ message: "Successfully fetched google calendar events", events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};
