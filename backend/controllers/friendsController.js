import prisma from "../utils/prismaClient.js";

import { validateEmail } from "../utils/helpers.js";

export const acceptRequest = async (req, res) => {
  const myId = req.user.id;
  const email = req.params.userEmail;
  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    return res.status(400).json({
      message: `Plesase input a valid email address to send to a friend, our server suggests that "${email}" is not valid`,
    });
  }
  try {
    const recipient = await prisma.user.findUnique({ where: { email: email } });
    if (!recipient) {
      return res.status(404).json({
        message: `We apologize for the inconvenience, but a user with the email ${email} does not exsist in our records`,
      });
    }
    const requestExists = await prisma.friendRequest.findFirst({
      where: {
        recipientId: myId,
        senderId: recipient.id,
      },
    });
    if (!requestExists) {
      return res.status(404).json({
        message: `We apologize for the inconvenience, but the friend request you are looking for does not exsist in our records. If this seems suspicious, please deny the request`,
      });
    }
    const friend = {
      userId: myId,
      friendEmail: email,
    };
    const newFriend = await prisma.friend.create({ data: friend });
    if (!newFriend) {
      return res.status(500).json({
        message: `We apologize for the inconvenience, something went wrong on the server and we could not process your request. Please reload the page and try again.`,
      });
    }
    if (newFriend) {
      return res.status(201).json({
        message: `You and ${recipient.username} are now friends`,
        friend: {
          avatarUrl: recipient.avatarUrl,
          username: recipient.username,
          email: recipient.email,
        },
      });
    }
  } catch (err) {
    console.log(ere);
  }
};

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
          .json({ message: `Friend request to ${email} already exists` });
      }
      const newFriendRequest = await prisma.friendRequest.create({
        data: newRequest,
      });
      if (!newFriendRequest) {
        return res.status(500).json({
          message: `There was an issue processing your friend request to the user with an email of ${email}. Please try to send the request again to the same user if you see the email is correct`,
        });
      }
      if (newFriendRequest) {
        return res.status(201).json({
          message: `Friend request sent to: ${email}`,
          request: {
            email: recipient.email,
            sentTime: newFriendRequest.createdAt,
            status: newFriendRequest.status,
            avatarUrl: newFriendRequest.avatarUrl,
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
          "Please log back in or refresh your application. An issue occurred fetching your personal data",
      });
    }
    const userFriends = await prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .friends();
    console.log(userFriends);
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

export const acceptFriendRequest = async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const userAvatar = req.user.avatarUrl;
  const requestEmail = req.body.requestEmail;
  if (!userId) {
    return res.status(401).json({
      message:
        "There was an error authenticating your request. Please login and try again",
    });
  }
  try {
    const requester = await prisma.user.findUnique({
      where: { email: requestEmail },
    });
    if (!requester) {
      return res.status(404).json({
        message:
          "We are sorry, but no user with that email exists in our records. If this friend request is from an unknown user, do not reply and contact support",
      });
    }
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: requester.id,
            recipientId: userId,
          },
          {
            senderId: userId,
            recipientId: requester.id,
          },
        ],
      },
    });
    if (!existingRequest) {
      return res.status(404).json({
        message:
          "No friend request exists to you from this user. Please refresh and if you continue to have issues, contact support",
      });
    }
    const newFriendConnections = [
      {
        userId: userId,
        friendEmail: requester.email,
        friendAvatar: requester.avatarUrl,
      },
      {
        userId: requester.id,
        friendEmail: userEmail,
        friendAvatar: userAvatar,
      },
    ];
    const newFriendships = await prisma.friend.createMany({
      data: newFriendConnections,
    });
    if (!newFriendships) {
      return res.status(500).json({
        message:
          "There was a problem accepting this friend request and we apologize but you will need to refresh and try again",
      });
    }
    const deleteRequest = await prisma.friendRequest.delete({
      where: { id: existingRequest.id },
    });
    return res.status(200).json({
      message: `You have successfully become friends with ${requestEmail}`,
      friendship: {
        userId: requester.id,
        friendEmail: requester.email,
        friendAvatar: requester.avatarUrl,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "We apologize, something went wrong with the server. Please give us some time to fix the issue and try canceling your friend request again",
    });
  }
};

export const cancelFriendRequest = async (req, res) => {
  const recipientsEmail = req.params.recipientsEmail;
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      message:
        "There was an error authenticating your request. Please login and try again",
    });
  }
  try {
    const recipient = await prisma.user.findUnique({
      where: { email: recipientsEmail },
    });
    if (!recipient) {
    }
    if (recipient) {
      const requestForFriendshipExists = await prisma.friendRequest.findFirst({
        where: { senderId: userId, recipientId: recipient.id },
      });
      if (!requestForFriendshipExists) {
        return res.status(404).json({
          message:
            "No friend request has been sent to this user by you. Please refresh your application and see if the friend request still persists. If so, please contact us",
        });
      }
      const deleteRequest = await prisma.friendRequest.delete({
        where: {
          id: requestForFriendshipExists.id,
        },
      });
      if (!deleteRequest) {
        return res.status(500).json({
          message:
            "There was a problem canceling your friend request. Please try to cancel your friend request one more time",
        });
      }
      return res.status(200).json({
        message: `Your friend request was successfully canceled to ${recipientsEmail}`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "We apologize, something went wrong with the server. Please give us some time to fix the issue and try canceling your friend request again",
    });
  }
};
