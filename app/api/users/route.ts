import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_PAGESIZE } from "@/lib/constants";
import {
  CreateFormSchema,
  EditFormSchema,
} from "@/app/(admin)/users/form-schema";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") ?? 1;
  const pageSize = searchParams.get("pageSize") ?? DEFAULT_PAGESIZE;
  const filters = searchParams.get("filters") ?? "{}";
  const sorting = searchParams.get("sorting") ?? "[]";

  const total = await prisma.user.count({
    where: JSON.parse(filters),
  });
  const items = await prisma.user.findMany({
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
    where: JSON.parse(filters),
    orderBy:
      JSON.parse(sorting).length > 0
        ? JSON.parse(sorting)
        : [{ createdAt: "desc" }],
  });

  return Response.json({
    total,
    page: Number(page),
    pageSize: Number(pageSize),
    items,
  });
}

export async function POST(request: Request) {
  const reqRaw = await request.json();
  const req = CreateFormSchema.safeParse(reqRaw);

  if (!req.success) {
    return NextResponse.json(req.error, { status: 417 });
  }

  const { name, email, password, role, status } = req.data;

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (user) {
      return NextResponse.json({ message: "用户已存在" }, { status: 417 });
    }

    const salt = bcrypt.genSaltSync();
    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hashSync(password, salt),
        role,
        status: Number(status),
      },
    });

    return Response.json({ data });
  } catch (err) {
    return NextResponse.json(err, { status: 417 });
  }
}

export async function PATCH(request: Request) {
  const reqRaw = await request.json();
  const { id } = reqRaw;
  const req = EditFormSchema.safeParse(reqRaw);

  if (!req.success) {
    return NextResponse.json(req.error, { status: 417 });
  }

  const { name, email, role, status } = req.data;

  try {
    const data = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        role,
        status: Number(status),
      },
    });

    return Response.json({ data });
  } catch (err) {
    return NextResponse.json({ message: "用户更新失败" }, { status: 417 });
  }
}

export async function DELETE(request: Request) {
  const req = await request.json();
  const { id } = req;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return NextResponse.json(
      { message: "用户不存在或已删除" },
      { status: 404 }
    );
  }

  if (user.isSuper) {
    return NextResponse.json(
      { message: "超级管理员不可删除" },
      { status: 403 }
    );
  }

  const data = await prisma.user.delete({
    where: { id },
  });

  return Response.json({ data });
}
