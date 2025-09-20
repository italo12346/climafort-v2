"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi"; // ícones de hamburger e X

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-10 relative px-4 py-3 bg-white shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
        BLOCOS VILA GALÉ
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Sair
        </button>

        {session?.user?.role === "admin" && (
          <Link
            href="/register"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Cadastrar
          </Link>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-800 focus:outline-none"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {menuOpen && (
          <div className="absolute right-4 top-full mt-2 w-40 bg-white border rounded-lg shadow-lg flex flex-col py-2 z-50">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-left hover:bg-red-100 text-red-600"
            >
              Sair
            </button>

            {session?.user?.role === "admin" && (
              <Link
                href="/register"
                className="px-4 py-2 hover:bg-blue-100 text-blue-600"
              >
                Cadastrar
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
