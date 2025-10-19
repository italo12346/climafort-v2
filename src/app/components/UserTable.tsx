"use client";

import { useState } from "react";

interface User {
  id: number;
  email: string;
  role: string;
}

export default function UserTable({ users }: { users: User[] }) {
  const [userList, setUserList] = useState(users);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUserList(userList.filter((user) => user.id !== id));
        alert("Usuário excluído com sucesso!");
      } else {
        alert("Erro ao excluir o usuário.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse rounded-2xl overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left">
            <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide">
              ID
            </th>
            <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide">
              Email
            </th>
            <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide">
              Função
            </th>
            <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userList.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-gray-700">{user.id}</td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {user.email}
              </td>
              <td>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    user.role === "ADMIN"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
