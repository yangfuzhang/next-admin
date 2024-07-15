import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { RolesEnum } from "@/types/enums";

const prisma = new PrismaClient();
async function main() {
  const salt = bcrypt.genSaltSync();

  const user1 = await prisma.user.create({
    data: {
      email: "2285511816@qq.com",
      name: "James Yang",
      password: bcrypt.hashSync("123456", salt),
      role: RolesEnum.SUPER,
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
