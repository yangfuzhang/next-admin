import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FormSchema } from "@/app/(admin)/chat/components/form-schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.bot.findMany({
    orderBy: {
      sort: "asc",
    },
  });

  return Response.json({
    code: 200,
    message: "success",
    items,
  });
}

export async function POST(request: Request) {
  const reqRaw = await request.json();
  const req = FormSchema.safeParse(reqRaw);

  if (!req.success) {
    return NextResponse.json(req.error, { status: 417 });
  }

  const { name, botId, sort, remark } = req.data;
  const dbBot = await prisma.bot.findFirst({
    where: {
      botId,
    },
  });

  if (dbBot) {
    return NextResponse.json({ message: "Bot已存在" }, { status: 417 });
  }

  try {
    const data = await prisma.bot.create({
      data: {
        name,
        botId,
        sort,
        remark,
      },
    });

    return Response.json({ data });
  } catch (error) {
    return NextResponse.json(error, { status: 417 });
  }
}

export async function PATCH(request: Request) {
  const reqRaw = await request.json();
  const { id } = reqRaw;
  const req = FormSchema.safeParse(reqRaw);

  if (!req.success) {
    return NextResponse.json(req.error, { status: 417 });
  }

  const { name, botId, sort, remark } = req.data;

  try {
    const data = await prisma.bot.update({
      where: { id },
      data: {
        name,
        botId,
        sort,
        remark,
      },
    });

    return Response.json({ data });
  } catch (error) {
    return NextResponse.json(error, { status: 417 });
  }
}

export async function DELETE(request: Request) {
  const req = await request.json();
  const { id } = req;
  const bot = await prisma.bot.findUnique({
    where: { id },
  });

  if (!bot) {
    return NextResponse.json({ message: "Bot不存在或已删除" }, { status: 404 });
  }

  const data = await prisma.bot.delete({
    where: { id },
  });

  return Response.json({ data });
}
