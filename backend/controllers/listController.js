import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getLists = async (req, res) => {
  const { id } = req.user;
  const lists = await prisma.list.findMany({
    where: {
      userId: id,
    },
  });
  if (lists) {
    return res
      .status(201)
      .json({ message: "Successfully fetched lists", lists: lists });
  }
  if (!lists) {
    return res
      .status(401)
      .json({ message: "An error occured while finding your lists" });
  }
};

export const addNewList = async (req, res) => {
  const newList = req.body.newList;
  const added = await prisma.list.create({
    data: newList,
  });
  if (added) {
    return res
      .status(201)
      .json({ message: "Your new list was created succefully!", list: added });
  }
  if (!added) {
    return res
      .status(401)
      .json({ message: "An error occured and your list was not sent" });
  }
};

export const updateList = async (req, res) => {};

export const deleteList = async (req, res) => {
  const listId = req.params.listId;
  const deletedList = await prisma.list.delete({
    where: {
      id: listId,
    },
  });
  if (deletedList) {
    res.status(201).json({ message: "Succesfully deleted list" });
  }
  if (!deletedList) {
    res.status(401).json({ message: "Failure deleting list" });
  }
};
