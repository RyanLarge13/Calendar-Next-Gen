import prisma from "../utils/prismaClient.js";

export const updateTaskTitle = async (req, res) => {
  const { newTitle, taskId } = req.body;
  const { id } = req.user;

  if (!id) {
    res
      .status(401)
      .json({ message: "You are not authorized to make this request" });
    return;
  }

  if (!newTitle || !taskId) {
    res.status(404).json({
      message:
        "Please pass in both the new task title and the id of the task to update",
    });
    return;
  }

  try {
    await prisma.task.update({
      where: { userId: id, id: taskId },
      data: { title: newTitle },
    });

    res.status(200).json({ message: "Successfully updated task title" });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong updating your task. Please contact the developer",
    });
    return;
  }
};

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

export const updateTasks = async (req, res) => {
  const { id } = req.user;
  if (!id) {
    return res.status(401).json({
      message:
        "You are not authorized to make this request. Please log back in and try again",
    });
  }
  const taskUpdates = req.body.taskUpdates;
  console.log(taskUpdates);
  if (taskUpdates.length < 1) {
    return res.status(400).json({ message: "You have no items to update" });
  }
  try {
    const updateAllTasks = async () => {
      for (const update of taskUpdates) {
        const { taskId, taskItems } = update;
        await prisma.task.updateMany({
          where: { id: taskId },
          data: { tasks: taskItems },
        });
      }
    };
    updateAllTasks()
      .then(() => {
        return res.status(200).json({ message: "Tasks successfully updated" });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "We could not successfully update your tasks" });
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "We could not successfully update your tasks" });
  }
};

export const updateTaskColor = async (req, res) => {
  const { taskId, newColor } = req.body;

  if (!taskId) {
    res.status(401).json({
      message:
        "Failed to update task color. Please make sure you are updating a valid task",
    });
  }

  if (!newColor) {
    res.status(401).json({
      message:
        "Failed to update task color. Please make sure you are updating with a new color",
    });
  }

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { color: newColor },
    });
    res.status(201).json({ message: "Successfully updated task color" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        " There was a problem updating your task color in the database, please try again",
    });
  }
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const deletedTask = await prisma.task.delete({ where: { id: taskId } });
    if (!deletedTask) {
      return res.status(401).json({
        message:
          "Failed to delete your task from the database, please refresh and try again",
      });
    }
    if (deletedTask) {
      return res.status(201).json({
        message: "Succesfully deleted your task",
        deletedTaskId: deletedTask.id,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        " There was a problem deleting your task from the database, please try again",
    });
  }
};
