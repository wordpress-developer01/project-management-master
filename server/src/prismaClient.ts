import { PrismaClient } from "@prisma/client";

// Export a single shared PrismaClient instance to avoid creating
// multiple connections when importing across modules.
const prisma = new PrismaClient();

export default prisma;
