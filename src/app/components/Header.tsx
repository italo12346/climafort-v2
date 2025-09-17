"use client";

import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-10 relative">
      <h1 className="text-4xl font-bold text-gray-800 text-center w-full tracking-tight">
        BLOCOS VILA GALÉ
      </h1>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="absolute right-6 top-0 mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Sair
      </button>
    </header>
  );
}
