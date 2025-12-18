// ============================================
// COMPONENT: HEADER DO ADMIN
// ============================================

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { LogOut, User, Bell } from "lucide-react";
import { toast } from "react-hot-toast";

// ============================================
// INTERFACE: Propriedades do Header
// ============================================
interface HeaderProps {
  title?: string; // Título da página, exibido no topo
}

// ============================================
// COMPONENT: Cabeçalho do painel administrativo
// ============================================
export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth(); // Dados do usuário e função de logout
  const router = useRouter(); // Navegação entre rotas

  // ============================================
  // FUNÇÃO: Realiza logout, exibe mensagem e redireciona para login
  // ============================================
  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  };

  // ============================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ============================================
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* ============================================ */}
        {/* SEÇÃO: Título da página */}
        {/* ============================================ */}
        <div>
          {title && (
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          )}
        </div>

        {/* ============================================ */}
        {/* SEÇÃO: Ações do usuário e notificações */}
        {/* ============================================ */}
        <div className="flex items-center gap-4">
          {/* Botão de notificações */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Informações do usuário autenticado */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Botão de logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
