"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="flex justify-between items-center mb-10 px-6 py-4 bg-gradient-to-r from-[#2b5a80] to-[#4479a1] shadow-lg text-white">
      <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
        BLOCOS VILA GALÉ
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        {isAdmin && (
          <Link
            href="/adminPage"
            className="px-5 py-2 bg-white text-[#4479a1] font-semibold rounded-full shadow-inner hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Perfis
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/register"
            className="px-5 py-2 bg-white text-[#4479a1] font-semibold rounded-full shadow-inner hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Cadastrar
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/listas"
            className="px-5 py-2 bg-white text-[#4479a1] font-semibold rounded-full shadow-inner hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Listas
          </Link>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-inner hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Sair
        </button>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 border rounded-xl shadow-lg flex flex-col py-2 z-50">
            {isAdmin && (
              <Link
                href="/adminPage"
                className="px-4 py-2 hover:bg-[#c1d6eb] text-[#4479a1] font-semibold rounded-lg transition-colors"
              >
                AdminPage
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/register"
                className="px-4 py-2 hover:bg-[#c1d6eb] text-[#4479a1] font-semibold rounded-lg transition-colors"
              >
                Cadastrar
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/listas"
                className="px-4 py-2 hover:bg-[#c1d6eb] text-[#4479a1] font-semibold rounded-lg transition-colors"
              >
                Listas
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-left hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
