// ============================================
// LAYOUT: PAINEL ADMINISTRATIVO
// ============================================

import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Loader } from "lucide-react";

// ============================================
// INTERFACE: Propriedades do layout administrativo
// ============================================
interface AdminLayoutProps {
  children: ReactNode; // Conteúdo renderizado dentro do layout
  title?: string; // Título exibido no Header
}

// ============================================
// COMPONENT: Layout geral do painel administrativo
// ============================================
export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, user, loading } = useAuth(); // Dados de autenticação
  const router = useRouter(); // Controle de navegação

  // ============================================
  // EFEITO: Verificação de autenticação
  // Redireciona para login caso o usuário não esteja autenticado
  // ============================================
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/admin");
      return;
    }
  }, [isAuthenticated, loading]);

  // ============================================
  // ESTADO: Exibição de loading
  // ============================================
  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  // ============================================
  // RENDERIZAÇÃO PRINCIPAL DO LAYOUT
  // ============================================
  return (
    <div className="flex h-screen bg-gray-100">
      {/* ============================================ */}
      {/* COMPONENTE: Sidebar (Menu lateral) */}
      {/* ============================================ */}
      <Sidebar />

      {/* ============================================ */}
      {/* SEÇÃO: Conteúdo principal */}
      {/* ============================================ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />

        {/* Área onde as páginas internas são exibidas */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
