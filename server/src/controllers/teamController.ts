import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        let productOwnerUsername: string | undefined = undefined;
        let projectManagerUsername: string | undefined = undefined;

        if (team.productOwnerUserId) {
          const productOwner = await prisma.user.findUnique({
            where: { userId: Number(team.productOwnerUserId) },
            select: { username: true },
          });
          productOwnerUsername = productOwner?.username;
        }

        if (team.projectManagerUserId) {
          const projectManager = await prisma.user.findUnique({
            where: { userId: Number(team.projectManagerUserId) },
            select: { username: true },
          });
          projectManagerUsername = projectManager?.username;
        }

        return {
          ...team,
          productOwnerUsername,
          projectManagerUsername,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};
