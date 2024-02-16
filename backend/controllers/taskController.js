import prisma from "../utils/prismaClient.js";

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
   task: createdTask
  });
 }
 if (!createdTask) {
  return res.status(401).json({
   message:
    "Failed to save your new task in the database, please refresh and try again"
  });
 }
};

// Creating this comment for my massive messup
export const updateTasks = async (req, res) => {
 const { taskUpdates } = req.body;
 try {
  const updateAllTasks = async () => {
   for (const update in taskUpdates) {
    const { taskId, taskItems } = update;
    await prisma.task.updateMany({
     where: { id: taskId, data: { tasks: taskItems } }
    });
   }
  };
  updateAllTasks()
   .then(() => {
    console.log(res)
    return res.status(201).json({ message: "Tasks successfully updated" });
   })
   .catch(err => {
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

export const deleteTask = async (req, res) => {
 const taskId = req.params.taskId;
 try {
  const deletedTask = await prisma.task.delete({ where: { id: taskId } });
  if (!deletedTask) {
   return res.status(401).json({
    message:
     "Failed to delete your task from the database, please refresh and try again"
   });
  }
  if (deletedTask) {
   return res.status(201).json({
    message: "Succesfully deleted your task",
    deletedTaskId: deletedTask.id
   });
  }
 } catch (err) {
  console.log(err);
  return res.status(500).json({
   message:
    " There was a problem deleting your task from the database, please try again"
  });
 }
};
