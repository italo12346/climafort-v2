import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  _req: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const { id } = await params; // <-- await obrigatório!

  if (!id) {
    return NextResponse.json({ message: "ID não fornecido" }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Usuário deletado com sucesso",
      deletedUser,
    });
  } catch (error: unknown) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { message: "Erro ao deletar usuário" },
      { status: 500 }
    );
  }
}
