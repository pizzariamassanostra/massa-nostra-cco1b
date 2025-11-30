// ============================================
// COMPONENTE: CARD DE PEDIDO
// ============================================
// Exibe um pedido com status, itens, total
// Mostra token de entrega
// Botão para ver detalhes ou cancelar
// ============================================

import React from "react";
import { Order } from "@/services/order.service";
import OrderStatusBadge from "./OrderStatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, MapPin, Clock } from "lucide-react";
import { useRouter } from "next/router";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const router = useRouter();

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  const formatPrice = (priceInCents: string) => {
    const price = parseFloat(priceInCents) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // FORMATAR DATA
  // ============================================
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  // ============================================
  // TRADUZIR MÉTODO DE PAGAMENTO
  // ============================================
  const translatePaymentMethod = (method: string) => {
    const translations: Record<string, string> = {
      pix: "PIX",
      dinheiro: "Dinheiro",
      cartao_debito: "Cartão de Débito",
      cartao_credito: "Cartão de Crédito",
    };
    return translations[method] || method;
  };

  // ============================================
  // NAVEGAR PARA DETALHES
  // ============================================
  const handleViewDetails = () => {
    router.push(`/meus-pedidos/${order.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* ============================================ */}
      {/* HEADER: Número e Status */}
      {/* ============================================ */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Pedido #{order.id}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* ============================================ */}
      {/* ITENS DO PEDIDO */}
      {/* ============================================ */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Itens:</h4>
        <ul className="space-y-1">
          {order.items?.map(
            (
              item: {
                quantity:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<React.AwaitedReactNode>
                  | null
                  | undefined;
                product: {
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<React.AwaitedReactNode>
                    | null
                    | undefined;
                };
                variant: {
                  label:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<React.AwaitedReactNode>
                    | null
                    | undefined;
                };
              },
              index: React.Key | null | undefined
            ) => (
              <li key={index} className="text-sm text-gray-600">
                {item.quantity}x {item.product?.name} ({item.variant?.label})
              </li>
            )
          )}
        </ul>
      </div>

      {/* ============================================ */}
      {/* ENDEREÇO DE ENTREGA */}
      {/* ============================================ */}
      {order.address && (
        <div className="mb-4 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            {order.address.street}, {order.address.number}
            {order.address.complement && ` - ${order.address.complement}`}
            <br />
            {order.address.neighborhood}, {order.address.city}/
            {order.address.state}
          </p>
        </div>
      )}

      {/* ============================================ */}
      {/* TOKEN DE ENTREGA */}
      {/* ============================================ */}
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

      {/* ============================================ */}
      {/* TEMPO ESTIMADO */}
      {/* ============================================ */}
      {(order.status === "confirmed" || order.status === "preparing") && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Tempo estimado: {order.estimated_time} minutos</span>
        </div>
      )}

      {/* ============================================ */}
      {/* FOOTER: Total e Botão */}
      {/* ============================================ */}
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

export default OrderCard;
