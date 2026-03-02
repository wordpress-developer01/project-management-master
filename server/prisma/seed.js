const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const prisma = new PrismaClient();

function fileToPrismaDelegateName(fileName) {
  const base = path.basename(fileName, path.extname(fileName));
  return base.charAt(0).toLowerCase() + base.slice(1);
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
      console.error(`[seed] Error seeding ${delegateName}:`, error);
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

  await deleteAllData([...orderedFileNames].reverse());
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