import { PrismaClient } from "@prisma/client";
import signToken from "../auth/signToken.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const login = async (req, res) => {
  const { id, username, email, avatarUrl } = req.user;
  const exsistingUser = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (exsistingUser) {
    await bcrypt.compare(id, exsistingUser.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const newSignture = signToken(exsistingUser);
      res.status(201).json({token: newSignture});
    });
  }
  if (!exsistingUser) {
    const newUser = {
      username,
      email,
      password: hashPassword(id),
      avatarUrl,
    };
    const createdUser = await prisma.user.create({
      data: newUser,
    });
    const newSignture = signToken(createdUser);
    res.status(201).json({token, newSignture})
  }
};
