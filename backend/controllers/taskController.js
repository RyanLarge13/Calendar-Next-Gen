import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getTasks = async (req, res) => {
  const { id } = req.user;
  const allTasks = await prisma.task.findMany({ where: { userId: id } });
  return res
    .status(201)
    .json({ message: "Successfully fetched tasks", tasks: allTasks });
};

export const createTask = async (req, res) => {
  const task = req.body.task;
  const createdTask = await prisma.task.create({ data: task });
  if (createdTask) {
    return res.status(201).json({
      message: "Successfully created your new task!",
      task: createdTask,
    });
  }
  if (!createdTask) {
    return res.status(401).json({
      message:
        "Failed to save your new task in the database, please refresh and try again",
    });
  }
};
