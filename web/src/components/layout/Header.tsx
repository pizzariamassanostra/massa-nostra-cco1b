// ============================================
// COMPONENTE: HEADER DO SITE
// ============================================
// Barra superior com logo, menu e carrinho
// Mostra quantidade de itens no carrinho
// Botão de login/perfil
// ============================================

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const router = useRouter();

  // ============================================
  // NAVEGAR PARA LOGIN
  // ============================================
  const handleLogin = () => {
    router.push("/login");
  };

  // ============================================
  // NAVEGAR PARA PERFIL
  // ============================================
  const handleProfile = () => {
    router.push("/meu-perfil");
  };

  // ============================================
  // FAZER LOGOUT
  // ============================================
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ============================================ */}
          {/* LOGO */}
          {/* ============================================ */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl">
              🍕
            </div>
            <span className="text-xl font-bold text-gray-800">
              Massa Nostra
            </span>
          </Link>

          {/* ============================================ */}
          {/* MENU DE NAVEGAÇÃO */}
          {/* ============================================ */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/cardapio"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
            >
              Cardápio
            </Link>

            {isAuthenticated && (
              <Link
                href="/meus-pedidos"
                className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
              >
                Meus Pedidos
              </Link>
            )}

            <Link
              href="/suporte"
              className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
            >
              Suporte
            </Link>
          </nav>

          {/* ============================================ */}
          {/* AÇÕES (Carrinho, Login/Perfil) */}
          {/* ============================================ */}
          <div className="flex items-center gap-4">
            {/* Botão do Carrinho */}
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />

              {/* Badge com quantidade */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botão Login/Perfil */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="w-6 h-6 text-gray-700" />
                  <span className="hidden md:block font-semibold text-gray-700">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => router.push("/meus-pedidos")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    Meus Pedidos
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
