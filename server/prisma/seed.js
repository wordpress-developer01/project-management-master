import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";


dotenv.config();

const prisma = new PrismaClient();

/**
 * Maps filenames like "projectTeam.json" -> prisma.projectTeam
 * (lowercase first letter)
 */
function fileToPrismaDelegateName(fileName) {
  const base = path.basename(fileName, path.extname(fileName)); // projectTeam
  return base.charAt(0).toLowerCase() + base.slice(1);          // projectTeam
}

async function deleteAllData(orderedFileNames) {
  for (const fileName of orderedFileNames) {
    const delegateName = fileToPrismaDelegateName(fileName);
    const model = prisma[delegateName];

    if (!model || typeof model.deleteMany !== "function") {
      console.warn(`[seed] Skip delete: prisma.${delegateName} not found`);
      continue;
    }

    try {
      await model.deleteMany({});
      console.log(`[seed] Cleared data from ${delegateName}`);
    } catch (error) {
      console.error(`[seed] Error clearing ${delegateName}:`, error);
    }
  }
}

async function seedFromFiles(orderedFileNames, dataDirectory) {
  for (const fileName of orderedFileNames) {
    const delegateName = fileToPrismaDelegateName(fileName);
    const model = prisma[delegateName];

    if (!model || typeof model.create !== "function") {
      console.warn(`[seed] Skip seed: prisma.${delegateName} not found`);
      continue;
    }

    const filePath = path.join(dataDirectory, fileName);

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (error) {
      console.error(`[seed] Cannot read/parse ${filePath}:`, error);
      continue;
    }

    if (!Array.isArray(jsonData)) {
      console.error(`[seed] ${fileName} must contain an array of objects`);
      continue;
    }

    try {
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`[seed] Seeded ${delegateName} with data from ${fileName}`);
    } catch (error) {
      console.error(`[seed] Error seeding ${delegateName} from ${fileName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.resolve(process.cwd(), "prisma", "seedData");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  console.log("[seed] Using seedData directory:", dataDirectory);

  // Delete in reverse order to avoid FK constraint issues
  await deleteAllData([...orderedFileNames].reverse());

  // Then insert in the intended order
  await seedFromFiles(orderedFileNames, dataDirectory);
}

main()
  .catch((e) => {
    console.error("[seed] Fatal error:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });