import prisma from "../utils/prismaClient.js";

const createKanbanFolders = async (kanbanId, folders) => {
  const foldersWithRef = folders.map((folder) => {
    return { ...folder, projectId: kanbanId };
  });
  try {
    const newFolders = await prisma.folders.createMany({
      data: foldersWithRef,
    });
    if (newFolders) {
      return newFolders;
    }
    if (!newFolders) {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const createNewKanban = async (req, res) => {
  const { title, color } = req.body.kanban;
  const id = req.user.id;
  const folders = req.body.kanban.folders;
  try {
    const newKanban = await prisma.kanban.create({
      data: { title, color, userId: id },
    });
    if (newKanban) {
      let kanbanFolders = [];
      if (folders.length > 0) {
        kanbanFolders = await createKanbanFolders(newKanban.id, folders);
      }
      return res.status(201).json({
        message: `Successfully created your new Kanban board${
          kanbanFolders.length > 0
            ? ". Unfortunately there was a problem creating the folders to your project. Please go into your new Kanban project and try again"
            : " and folders associated with your project"
        }`,
        kanaban: newKanban,
      });
    }
    if (!newKanban) {
      return res.status(401).json({
        message:
          "There was a problem creating your kanban board. Please try again",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "Something went wrong with the server and creating your new kanban board. Please reload the app and try again",
    });
  }
};
