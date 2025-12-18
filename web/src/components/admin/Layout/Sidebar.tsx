// ============================================
// COMPONENT: SIDEBAR DO ADMIN
// ============================================

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Warehouse,
  Truck,
  Settings,
  Pizza,
} from "lucide-react";

// ============================================
// CONSTANTE: Lista de itens exibidos no menu lateral
// ============================================
const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Pedidos",
    href: "/admin/pedidos",
    icon: ShoppingBag,
  },
  {
    label: "Produtos",
    href: "/admin/produtos",
    icon: Pizza,
  },
  {
    label: "Clientes",
    href: "/admin/clientes",
    icon: Users,
  },
  {
    label: "Relatórios",
    href: "/admin/relatorios",
    icon: BarChart3,
  },
  {
    label: "Estoque",
    href: "/admin/estoque",
    icon: Warehouse,
  },
  {
    label: "Fornecedores",
    href: "/admin/fornecedores",
    icon: Truck,
  },
  {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

// ============================================
// COMPONENT: Sidebar (Menu lateral do admin)
// ============================================
export default function Sidebar() {
  const router = useRouter(); // Acesso à rota atual

  // ============================================
  // FUNÇÃO: Verifica se o item do menu corresponde à rota atual
  // ============================================
  const isActive = (href: string) => {
    if (href === "/admin") {
      return router.pathname === "/admin";
    }
    return router.pathname.startsWith(href);
  };

  // ============================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ============================================
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* ============================================ */}
      {/* Logo do sistema */}
      {/* ============================================ */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-red-500">🍕 Massa Nostra</h1>
        <p className="text-xs text-gray-400 mt-1">Painel Administrativo</p>
      </div>

      {/* ============================================ */}
      {/* Navegação do menu */}
      {/* ============================================ */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ============================================ */}
      {/* Rodapé do sidebar */}
      {/* ============================================ */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          © 2025 Pizzaria Massa Nostra
        </p>
      </div>
    </aside>
  );
}
