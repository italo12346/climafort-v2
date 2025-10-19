import { prisma } from "../../../prisma/prisma";
import Header from "../components/Header";
import UserTable from "../components/UserTable";
import AccessDenied from "../components/AccessDenied";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/app/api/auth/[...nextauth]/auth";

export default async function AdminPage() {
  // Obtém a sessão do usuário
  const session = await getServerSession(authOptions);

  // Se não for admin, mostra a tela de acesso negado
  if (!session || session.user.role !== "admin") {
    return <AccessDenied />;
  }

  // Busca os usuários no banco
  const dbUser = await prisma.user.findMany();

  return (
    <>
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Lista de Usuários
        </h1>
        <UserTable users={dbUser} />
      </div>
    </>
  );
}
