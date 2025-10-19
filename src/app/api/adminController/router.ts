import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth"; // ajusta o path

const prisma = new PrismaClient();

export async function Controller(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // pega o user logado
  const dbUser = await prisma.user.findMany();
  return dbUser;
}
