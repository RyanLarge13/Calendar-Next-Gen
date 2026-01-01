import prisma from "../../utils/prismaClient.js";

try {
    await prisma.$executeRaw`
        DELETE FROM "Event"
        WHERE repeats IS NOT NULL
        AND repeats::text NOT IN ('{}', '[]');
    `;
} catch (err) {
    console.log(err);
}