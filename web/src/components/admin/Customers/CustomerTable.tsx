// ============================================
// COMPONENT: CUSTOMER TABLE
// ============================================

import React from "react";
import Link from "next/link";
import { Eye, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ============================================
// INTERFACES
// ============================================
export interface Customer {
  id: number; // ID do cliente
  name: string; // Nome completo
  email: string; // E-mail
  phone: string; // Telefone
  cpf?: string; // CPF (opcional)
  created_at: string; // Data de cadastro
  total_orders?: number; // Total de pedidos (opcional)
  total_spent?: number; // Total gasto em centavos (opcional)
}

// ============================================
// INTERFACE: Propriedades do componente
// ============================================
interface CustomerTableProps {
  customers: Customer[]; // Lista de clientes
}

// ============================================
// COMPONENTE
// ============================================
export default function CustomerTable({ customers }: CustomerTableProps) {
  // ============================================
  // FUNÇÃO: Formatar valor monetário (centavos → BRL)
  // ============================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100); // Converte centavos para reais
  };

  // ============================================
  // FUNÇÃO: Formatar data no padrão brasileiro
  // ============================================
  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ============================================ */}
          {/* CABEÇALHO DA TABELA */}
          {/* ============================================ */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Gasto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cadastro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          {/* ============================================ */}
          {/* CORPO DA TABELA */}
          {/* ============================================ */}
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  {/* ============================================ */}
                  {/* COLUNA: Nome do cliente */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">
                          {customer.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ============================================ */}
                  {/* COLUNA: Contato (email e telefone) */}
                  {/* ============================================ */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* ============================================ */}
                  {/* COLUNA: CPF */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {customer.cpf || "—"}
                    </span>
                  </td>

                  {/* ============================================ */}
                  {/* COLUNA: Total de pedidos */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {customer.total_orders || 0}
                    </span>
                  </td>

                  {/* ============================================ */}
                  {/* COLUNA: Total gasto */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(customer.total_spent || 0)}
                    </span>
                  </td>

                  {/* ============================================ */}
                  {/* COLUNA: Data de cadastro */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {formatDate(customer.created_at)}
                    </span>
                  </td>

                  {/* ============================================ */}
                  {/* COLUNA: Ações */}
                  {/* ============================================ */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/admin/clientes/${customer.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
