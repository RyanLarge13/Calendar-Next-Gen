import prisma from "../utils/prismaClient.js";
import { google } from "googleapis";
import { getOAuth2Client } from "../utils/helpers.js";
import signToken from "../auth/signToken.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendSocialWelcomeEmail } from "../utils/sendMail.js";
import Axios from "axios";

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const fetchUserData = async (req, res) => {
  const id = req.user.id;
  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        events: true,
        reminders: true,
        lists: true,
        tasks: true,
        kanbans: {
          folders: {
            boards: {
              boardItems: true,
            },
          },
        },
        categories: true,
        stickies: true,
      },
    });
    if (userData) {
      res.status(200).json({
        message: "Successfully fetched user data",
        user: userData,
      });
    }
    if (!userData) {
      return res.status(401).json({
        message:
          "There was a problem fetching your data from the database. Please refresh your page or trying to log back in",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "There was an error on the server trying to process your data, please refresh and try again",
    });
  }
};

export const loginWithGoogle = async (req, res) => {
  const { id, username, email, avatarUrl } = req.body.user;
  try {
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
        const userToSign = {
          id: exsistingUser.id,
          username: exsistingUser.username,
          email: exsistingUser.email,
          avatarUrl: exsistingUser.avatarUrl,
        };
        const newSignture = signToken(userToSign);
        return res.status(201).json({
          token: newSignture,
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
      if (createdUser) {
        const userToSign = {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          avatarUrl: createdUser.avatarUrl,
        };
        const newSignture = signToken(userToSign);
        res.status(201).json({
          token: newSignture,
        });
        return sendSocialWelcomeEmail(email, username, "Google");
      }
      if (!createdUser) {
        return res.statu(401).json({
          message:
            "There was a problem with creating a new account on Calng.app. Please refresh the application and try again",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "An error occured on the server and your login attempt could not be completed. Please refresh and try again",
    });
  }
};

export const loginWithFacebook = async (req, res) => {
  const { accessToken } = req.body;
  try {
    const fbResponse = await Axios.get(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const userData = fbResponse.data;
    const exsistingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (exsistingUser) {
      await bcrypt
        .compare(userData.id, exsistingUser.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
          }
          const userToSign = {
            id: exsistingUser.id,
            username: exsistingUser.username,
            email: exsistingUser.email,
            avatarUrl: exsistingUser.avatarUrl,
          };
          const newSignture = signToken(userToSign);
          return res.status(201).json({
            token: newSignture,
          });
        });
    }
    if (!exsistingUser) {
      const hashedPassword = await hashPassword(userData.id);
      const fbUser = {
        username: userData.name,
        email: userData.email,
        password: hashedPassword,
        avatarUrl: userData.picture.url,
      };
      const newFbUser = await prisma.user.create({ data: fbUser });
      if (newFbUser) {
        const userToSign = {
          id: newFbUser.id,
          username: newFbUser.username,
          email: newFbUser.email,
          avatarUrl: newFbUser.avatarUrl,
        };
        const newSignture = signToken(userToSign);
        res.status(201).json({
          token: newSignture,
        });
      }
      if (!newFbUser) {
        return res.statu(401).json({
          message:
            "There was a problem with creating a new account on Calng.app. Please refresh the application and try again",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Authentication failed" });
  }
};

export const loginWithPasswordUsername = async (req, res) => {
  const { username, email, password, avatarUrl } = req.body;
  try {
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
        const userToSign = {
          id: exsistingUser.id,
          username: exsistingUser.username,
          email: exsistingUser.email,
          avatarUrl: exsistingUser.avatarUrl,
        };
        const newSignture = signToken(userToSign);
        res.status(201).json({
          token: newSignture,
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
      if (createdUser) {
        const userToSign = {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          avatarUrl: createdUser.avatarUrl,
        };
        const newSignture = signToken(userToSign);
        res.status(201).json({
          token: newSignture,
        });
        return sendWelcomeEmail(email, username, password);
      }
      if (!createdUser) {
        return res.statu(401).json({
          message:
            "There was a problem with creating a new account on Calng.app. Please refresh the applicaiton and try again",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Authentication failed" });
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
