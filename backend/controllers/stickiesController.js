import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllStickies = async (req, res) => {
  const { id } = req.user;
  try {
    const usersStickies = await prisma.sticky.findMany({
      where: { userId: id },
    });
    if (!usersStickies) {
      return res.status(401).json({
        message:
          "An error occurred while fetching your data. Please give us a few seconds to fix the issue and try again.",
      });
    }
    if (usersStickies) {
      return res.status(201).json({
        message: "Successfully fetched users stickies.",
        stickies: usersStickies,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred on the server please try to reload",
    });
  }
};

export const addNewSticky = async (req, res) => {
  const userId = req.user.id;
  const sticky = { ...req.body.sticky, userId: userId };
  try {
    const newSticky = await prisma.sticky.create({ data: sticky });
    if (!newSticky) {
      return res.status(401).json({
        message:
          "An error occurred processing your request, please give us time to fix the problem and try again in a few seconds",
      });
    }
    if (newSticky) {
      return res.status(201).json({
        message: "Successfully created your new sticky!",
        sticky: newSticky,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "I am terribly sorry, something went wrong on the server, please try to create a new sticky",
    });
  }
};

export const deleteSticky = async (req, res) => {
  const stickyId = req.params.stickyId;
  if (!stickyId) {
    return res
      .status(401)
      .json({
        messagr: "Please refer to an ID that is valid to your sticky note",
      });
  }
  try {
    const deletedSticky = await prisma.sticky.delete({
      where: { id: stickyId },
    });
    if (!deletedSticky) {
    	return res.status(401).json({message: "We were not capable of deleting your sticky note. Please try to delete your sticky note again"})
    }
    if (deletedSticky) {
    	return res.status(201).json({message:"Successfully deleted your sticky note"})
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "I am terribly sorry, something went wrong on the server, please try to delete your sticky again",
    });
  }
};
