import { PrismaClient } from "@prisma/client";
import signToken from "../auth/signToken.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const fetchUserData = (req, res) => {
  const { username, email, avatarUrl, birthday, id, createAt } = req.user;
  res
    .status(200)
    .json({
      message: "Success",
      user: { username, email, avatarUrl, birthday, id, createAt },
    });
};

export const loginWithGoogle = async (req, res) => {
  const { id, username, email, avatarUrl } = req.body.user;
  const exsistingUser = await prisma.user.findUnique({
    where: {
      username_email: {
        username: username,
        email: email,
      },
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
  }
};

export const loginWithPasswordUsername = async (req, res) => {
  const { username, email, password, avatarUrl } = req.body;
  const exsistingUser = await prisma.user.findUnique({
    where: {
      username_email: {
        username: username,
        email: email,
      },
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
  }
};
