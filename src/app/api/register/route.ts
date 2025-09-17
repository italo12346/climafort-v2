import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({ data: { email, password: hashed } });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
  }
}
