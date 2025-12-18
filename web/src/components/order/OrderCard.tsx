// ============================================
// COMPONENTE: CARD DE PEDIDO
// ============================================
// Exibe informações resumidas do pedido
// Inclui status, itens, endereço, total e acesso aos detalhes
// ============================================

import React from "react";
import { Order } from "@/services/order.service";
import OrderStatusBadge from "./OrderStatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, MapPin, Clock } from "lucide-react";
import { useRouter } from "next/router";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface OrderCardProps {
  order: Order; // Dados completos do pedido
}

// ============================================
// COMPONENTE: OrderCard
// ============================================
const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const router = useRouter();

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  // Converte centavos para reais e aplica formatação PT-BR
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "string" ? Number(price) : price; // Garantir número
    const priceInReais = numPrice / 100; // Converter centavos para reais
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInReais);
  };

  // ============================================
  // FORMATAR DATA
  // ============================================
  // Exibe data no formato brasileiro com horário
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  // ============================================
  // TRADUZIR MÉTODO DE PAGAMENTO
  // ============================================
  const translatePaymentMethod = (method: string): string => {
    const translations: Record<string, string> = {
      pix: "PIX",
      dinheiro: "Dinheiro",
      cartao_debito: "Cartão de Débito",
      cartao_credito: "Cartão de Crédito",
    };
    return translations[method] || method; // Fallback para valor original
  };

  // ============================================
  // NAVEGAR PARA DETALHES DO PEDIDO
  // ============================================
  const handleViewDetails = (): void => {
    router.push(`/meus-pedidos/${order.id}`);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* HEADER: NÚMERO DO PEDIDO E STATUS */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Pedido #{order.id}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(order.created_at)}
          </p>
        </div>
        {/* Badge visual do status do pedido */}
        <OrderStatusBadge status={order.status} />
      </div>
      {/* ITENS DO PEDIDO */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Itens:</h4>

        <ul className="space-y-1">
          {order.items?.map((item, index) => (
            <li
              key={item.id || index} // Fallback para index caso não exista ID
              className="text-sm text-gray-600"
            >
              <span className="font-semibold">
                {item.quantity}x{" "}
                {item.product?.name || item.product_name || "Produto"}
              </span>

              {/* Variante do produto (se existir) */}
              <span className="text-gray-600 ml-2">
                ({item.variant?.label || item.variant_label || ""})
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* ENDEREÇO DE ENTREGA */}
      {order.delivery_address && (
        <div className="mb-4 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />

          <p className="text-sm text-gray-600">
            {order.delivery_address.street}, {order.delivery_address.number}
            {order.delivery_address.complement &&
              `, ${order.delivery_address.complement}`}
            <br />
            {order.delivery_address.neighborhood}, {order.delivery_address.city}
            /{order.delivery_address.state}
            <br />
            CEP: {order.delivery_address.zip_code}
          </p>
        </div>
      )}
      {/* TOKEN DE ENTREGA (SOMENTE EM ROTA) */}
      {order.status === "on_delivery" && order.delivery_token && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800 mb-1">
            Token de Entrega:
          </p>

          <p className="text-2xl font-bold text-yellow-900 tracking-widest">
            {order.delivery_token}
          </p>

          <p className="text-xs text-yellow-700 mt-1">
            Informe este código ao entregador
          </p>
        </div>
      )}
      {/* TEMPO ESTIMADO DE PREPARO */}
      {(order.status === "confirmed" || order.status === "preparing") &&
        order.estimated_time && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Tempo estimado: {order.estimated_time} minutos</span>
          </div>
        )}
      {/* FOOTER: TOTAL E AÇÃO */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-sm text-gray-500">Total</p>

          <p className="text-xl font-bold text-red-600">
            {formatPrice(order.total)}
          </p>

          <p className="text-xs text-gray-500">
            {translatePaymentMethod(order.payment_method)}
          </p>
        </div>

        {/* Botão para acessar detalhes do pedido */}
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
        >
          Ver Detalhes
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// EXPORTAÇÃO
// ============================================
export default OrderCard;
