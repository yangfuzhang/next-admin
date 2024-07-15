import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const reqRaw = await request.json();
  const { id, password, confirmPassword } = reqRaw;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return NextResponse.json({ message: "用户不存在" }, { status: 404 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "确认密码不一致" }, { status: 417 });
  }

  try {
    const salt = bcrypt.genSaltSync();
    const data = await prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hashSync(password, salt),
      },
    });

    return Response.json({ data });
  } catch (error) {
    return NextResponse.json(error, { status: 417 });
  }
}
