// ============================================
// COMPONENT: ORDER MODAL
// ============================================

import React, { useState } from "react";
import { X, User, MapPin, CreditCard, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { adminService } from "@/services/admin/admin.service";

// ============================================
// INTERFACE: Item individual do pedido
// ============================================
interface OrderItem {
  id: number;
  product_name: string; // Nome do produto
  variant_label: string; // Variante (ex.: tamanho)
  quantity: number; // Quantidade pedida
  unit_price: number; // Preço unitário
  total_price: number; // Preço total do item
  crust_name?: string; // Borda opcional
  filling_name?: string; // Recheio adicional opcional
}

// ============================================
// INTERFACE: Estrutura completa do pedido
// ============================================
interface OrderDetails {
  id: number;
  order_number: string; // Número identificador do pedido
  status: string; // Status atual (pending, delivered, etc.)
  payment_method: string; // Forma de pagamento
  total: number; // Valor total do pedido
  created_at: string; // Data de criação
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery_address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  items: OrderItem[]; // Itens do pedido
  delivery_token?: string; // Token para rastreamento da entrega
}

// ============================================
// INTERFACE: Propriedades do modaL
// ============================================
interface OrderModalProps {
  isOpen: boolean; // Controle de visibilidade do modal
  order: OrderDetails | null; // Dados do pedido aberto
  onClose: () => void; // Função de fechamento
  onStatusUpdated?: () => void; // Callback disparado após atualização de status
}

// ============================================
// COMPONENT: Modal de detalhes de pedido
// ============================================
export default function OrderModal({
  isOpen,
  order,
  onClose,
  onStatusUpdated,
}: OrderModalProps) {
  const [updating, setUpdating] = useState(false); // Estado de carregamento ao atualizar status

  // ============================================
  // FUNÇÃO: Atualiza o status do pedido e notifica o usuário
  // ============================================
  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);
      await adminService.updateOrderStatus(order.id, newStatus);
      toast.success("Status atualizado com sucesso!");
      onStatusUpdated?.();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setUpdating(false);
    }
  };

  // ============================================
  // FUNÇÃO: Formata valores numéricos em moeda brasileira
  // ============================================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // ============================================
  // FUNÇÃO: Formata datas com padrão brasileiro
  // ============================================
  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // ============================================
  // RENDER: Não exibir nada quando modal está fechado
  // ============================================
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {order.order_number}
            </h2>
            <p className="text-sm text-gray-600">
              {formatDate(order.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* STATUS E PAGAMENTO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Atual
              </label>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pagamento
              </label>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-900">
                  {order.payment_method.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* DADOS DO CLIENTE */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Dados do Cliente</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Nome:</span>{" "}
                <span className="text-gray-900 font-medium">
                  {order.customer.name}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Email:</span>{" "}
                <span className="text-gray-900">{order.customer.email}</span>
              </p>
              <p>
                <span className="text-gray-600">Telefone:</span>{" "}
                <span className="text-gray-900">{order.customer.phone}</span>
              </p>
            </div>
          </div>

          {/* ENDEREÇO DE ENTREGA */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">
                Endereço de Entrega
              </h3>
            </div>
            <p className="text-sm text-gray-900">
              {order.delivery_address.street}, {order.delivery_address.number}
              {order.delivery_address.complement &&
                ` - ${order.delivery_address.complement}`}
              <br />
              {order.delivery_address.neighborhood},{" "}
              {order.delivery_address.city}/{order.delivery_address.state}
              <br />
              CEP: {order.delivery_address.zip_code}
            </p>
          </div>

          {/* TOKEN DE ENTREGA */}
          {order.delivery_token && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Token de Entrega:</span>{" "}
                <span className="text-2xl font-bold text-yellow-800 ml-2">
                  {order.delivery_token}
                </span>
              </p>
            </div>
          )}

          {/* ITENS DO PEDIDO */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Itens do Pedido</h3>
            </div>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.quantity}x {item.product_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.variant_label}
                      {item.crust_name && ` - Borda: ${item.crust_name}`}
                      {item.filling_name && ` - Recheio: ${item.filling_name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.total_price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.unit_price)} un.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-gray-800">Total:</span>
              <span className="text-red-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* ATUALIZAR STATUS */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Atualizar Status do Pedido
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { value: "confirmed", label: "Confirmar" },
                { value: "preparing", label: "Em Preparo" },
                { value: "out_for_delivery", label: "Saiu p/ Entrega" },
                { value: "delivered", label: "Entregue" },
                { value: "cancelled", label: "Cancelar" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleUpdateStatus(status.value)}
                  disabled={updating || order.status === status.value}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    order.status === status.value
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
