import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ message: "ID não fornecido" }, { status: 400 });

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({
      message: "Usuário deletado com sucesso",
      deletedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao deletar usuário" },
      { status: 500 }
    );
  }
}
