// ============================================
// COMPONENT: ORDER TABLE
// ============================================

import React from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { Eye, Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ============================================
// INTERFACES
// ============================================
export interface Order {
  id: number;
  order_number: string; // Número identificador do pedido
  customer_name: string; // Nome do cliente
  total: number; // Valor total do pedido
  status: string; // Status atual do pedido
  payment_method: string; // Forma de pagamento
  created_at: string; // Data de criação
  delivery_address?: string; // Endereço de entrega (opcional)
}

interface OrderTableProps {
  orders: Order[]; // Lista de pedidos
  onPrintReceipt?: (orderId: number) => void; // Callback para impressão
}

// ============================================
// COMPONENTE
// ============================================
export default function OrderTable({
  orders,
  onPrintReceipt,
}: OrderTableProps) {
  // ============================================
  // FORMATAR MOEDA
  // ============================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // ============================================
  // FORMATAR DATA E HORA
  // ============================================
  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  // ============================================
  // FORMATAR FORMA DE PAGAMENTO
  // ============================================
  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      pix: "PIX",
      dinheiro: "Dinheiro",
      cartao_debito: "Cartão Débito",
      cartao_credito: "Cartão Crédito",
    };

    return methods[method] || method; // Fallback caso não exista no mapa
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ============================================ */}
          {/* CABEÇALHO */}
          {/* ============================================ */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pagamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          {/* ============================================ */}
          {/* CORPO */}
          {/* ============================================ */}
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              // Nenhum pedido encontrado
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  {/* Número do Pedido */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      {order.order_number}
                    </Link>
                  </td>

                  {/* Cliente e Endereço */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customer_name}
                    </div>
                    {order.delivery_address && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {order.delivery_address}
                      </div>
                    )}
                  </td>

                  {/* Data e Hora */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </div>
                  </td>

                  {/* Forma de Pagamento */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPaymentMethod(order.payment_method)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Ver Detalhes */}
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Imprimir Comprovante */}
                      {onPrintReceipt && (
                        <button
                          onClick={() => onPrintReceipt(order.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Imprimir comprovante"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
