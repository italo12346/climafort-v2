// components/AccessDenied.tsx
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acesso Negado</h1>
      <p className="text-gray-700 mb-6 text-center">
        Você não tem permissão para acessar esta página.
      </p>
      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
