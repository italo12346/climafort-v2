import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@climafort.com" },
    update: {},
    create: {
      email: "admin@climafort.com",
      password,
      role: "admin", // 👈 admin definido no código
    },
  });
}

main()
  .then(() => console.log("Admin criado com sucesso 🚀"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
