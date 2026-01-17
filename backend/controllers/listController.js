import prisma from "../utils/prismaClient.js";

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

export const updateListTitle = async (req, res) => {
  const { listId, newTitle } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!newTitle || !listId) {
    res
      .status(400)
      .json({ message: "Please provide a valid list and title to update" });
    return;
  }

  try {
    await prisma.list.update({
      where: { id: listId, userId: id },
      data: { title: newTitle },
    });
    res.status(200).sjon({ message: "Successfully updated list title" });
    return;
  } catch (err) {
    res
      .status(500)
      .json({ message: `Server error updating list title. Error: ${err}` });
    return;
  }
};

export const updateList = async (req, res) => {
  const lists = req.body.listUpdate;
  const updateLists = async () => {
    for (const update of lists) {
      const { listId, listItems } = update;
      await prisma.list.updateMany({
        where: { id: listId },
        data: { items: listItems },
      });
    }
  };
  updateLists()
    .then(() => {
      return res
        .status(201)
        .json({ message: "Successfuly updated all lists!" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ message: "Error updating your lists" });
    });
};

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
