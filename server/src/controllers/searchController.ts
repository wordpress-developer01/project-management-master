import { Request, Response } from "express";
import prisma from "../prismaClient";

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  const q = typeof query === "string" ? query : String(query || "");
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: q } }],
      },
    });
    res.json({ tasks, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
