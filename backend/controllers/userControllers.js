import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const login = async (req, res) => {
  const user = await prisma.user.findMany();
  console.log(user);
};
