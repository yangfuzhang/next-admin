import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
  const salt = bcrypt.genSaltSync();

  const user1 = await prisma.user.create({
    data: {
      email: process.env.SUPER_ADMIN_EMAIL!,
      name: process.env.SUPER_ADMIN_NAME!,
      password: bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD!, salt),
      role: "super",
      status: 1,
      isSuper: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
