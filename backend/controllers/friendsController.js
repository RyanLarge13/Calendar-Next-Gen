import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { validateEmail } from "../utils/helpers.js";

export const sendRequestFromQrCode = (req, res) => {};

export const sendRequestFromEmail = async (req, res) => {
  // dont forget to add in notification for a new friend request. send it to the user being requested

  const email = req.params.userEmail;
  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    return res.status(400).json({
      message: `Plesase input a valid email address to send to a friend our server suggests that "${email}" is not a valid`,
    });
  }
  const myId = req.user.id;
  try {
    const recipient = await prisma.user.findUnique({ where: { email: email } });
    if (!recipient) {
      return res.status(404).json({
        message: `We appologize but a user with the email of ${email} does not exsist within this application`,
      });
    }
    if (recipient) {
      const newRequest = {
        senderId: myId,
        recipientId: recipient.id,
        status: "pending",
      };
      const existingRequest = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              senderId: myId,
              recipientId: recipient.id,
            },
            {
              senderId: recipient.id,
              recipientId: myId,
            },
          ],
        },
      });
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: `Friend request to ${email} already exsists` });
      }
      const newFriendRequest = await prisma.friendRequest.create({
        data: newRequest,
      });
      if (!newFriendRequest) {
        return res.status(500).json({
          message: `There was an issue proccessing your friend request to the user with an email of ${email}. Please try to send the request again to the same user if you see the email is correct`,
        });
      }
      if (newFriendRequest) {
        return res.status(201).json({
          message: `Friend request sent to: ${email}`,
          request: {
            email: recipient.email,
            sentTime: newFriendRequest.createdAt,
            status: newFriendRequest.status,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "Server error occured. Please refresh and try again with your request.",
    });
  }
};

export const findUsersRequestsAndFriends = async (req, res) => {
  const user = req.user;
  try {
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (!foundUser) {
      return res.status(404).json({
        message:
          "Please log back in or refresh your application. An issue occured fetching your personal data",
      });
    }
    const userFriends = await prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .friends({
        select: {
          User: {
            select: {
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    const userFriendRequestsReceived = await prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .friendRequestsReceived({
        select: {
          sender: {
            select: {
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    const userFriendRequestsSent = await prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .friendRequestsSent({
        select: {
          recipient: {
            select: {
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    return res.status(200).json({
      message: "Successfully imported user friend data",
      userFriends: userFriends,
      friendRequests: userFriendRequestsReceived,
      connectionRequests: userFriendRequestsSent,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Server error, please try to re-fetch clients connections data`,
    });
  }
};
