/**
 * ============================================
 * COMPONENTE: OrderPreparingTimeline
 * ============================================
 * Timeline visual mostrando progresso do pedido
 * Estilo iFood com animações
 *
 * Remover "as const" de ternários (causa erro TypeScript)
 *
 * Estados:
 * - confirmed: Pedido recebido
 * - preparing: Em preparação
 * - ready: Pronto para saída
 * - delivering: Saiu para entrega
 * - delivered: Entregue
 * ============================================
 */

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Truck,
  MapPin,
  AlertCircle,
} from "lucide-react";

/**
 * Props do componente
 */
interface OrderPreparingTimelineProps {
  orderStatus: string | null; // Status atual do pedido
  estimatedTime?: number; // Tempo estimado em minutos
  orderNumber?: number; // Número do pedido
  isLoading?: boolean; // Está carregando?
}

/**
 * Tipo para cada etapa da timeline
 */
interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "active" | "pending";
}

/**
 * ============================================
 * COMPONENTE: OrderPreparingTimeline
 * ============================================
 */
export const OrderPreparingTimeline: React.FC<OrderPreparingTimelineProps> = ({
  orderStatus = "confirmed",
  estimatedTime = 30,
  orderNumber,
  isLoading = false,
}) => {
  // ============================================
  // ESTADO LOCAL
  // ============================================
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);

  // ============================================
  // FUNÇÃO: Determinar status da etapa
  // ============================================
  /**
   * Helper para determinar status da etapa
   * Evita erro TypeScript com "as const" em ternários
   */
  const getStepStatus = (
    condition: boolean,
    statusIfTrue: "completed" | "active" | "pending",
    statusIfFalse: "completed" | "active" | "pending"
  ): "completed" | "active" | "pending" => {
    return condition ? statusIfTrue : statusIfFalse;
  };

  // ============================================
  // FUNÇÃO: Mapear status para etapas
  // ============================================
  /**
   * Converte status do pedido em array de etapas com estados
   * Exemplos:
   * - confirmed → etapa 1 concluída, etapa 2 ativa
   * - preparing → etapa 2 ativa, etapa 3 pendente
   * - delivering → etapa 3 concluída, etapa 4 ativa
   */
  const getTimelineSteps = (): TimelineStep[] => {
    const baseSteps: TimelineStep[] = [
      {
        id: "received",
        label: "Pedido Recebido",
        description: "Seu pedido foi confirmado",
        icon: <CheckCircle className="w-6 h-6" />,
        status: "completed",
      },
      {
        id: "preparing",
        label: "Em Preparação",
        description: "Nossa equipe está preparando sua pizza",
        icon: <TrendingUp className="w-6 h-6" />,
        status: getStepStatus(
          orderStatus === "confirmed",
          "active",
          "completed"
        ),
      },
      {
        id: "ready",
        label: "Pronto para Saída",
        description: "Sua pizza está pronta",
        icon: <CheckCircle className="w-6 h-6" />,
        status:
          orderStatus === "preparing" || orderStatus === "ready"
            ? orderStatus === "ready"
              ? "completed"
              : "pending"
            : "pending",
      },
      {
        id: "delivering",
        label: "Saiu para Entrega",
        description: "Seu motoboy está a caminho",
        icon: <Truck className="w-6 h-6" />,
        status: getStepStatus(
          orderStatus === "delivering",
          "active",
          "pending"
        ),
      },
      {
        id: "delivered",
        label: "Entregue",
        description: "Aproveite sua pizza!",
        icon: <MapPin className="w-6 h-6" />,
        status: getStepStatus(
          orderStatus === "delivered",
          "completed",
          "pending"
        ),
      },
    ];

    return baseSteps;
  };

  // ============================================
  // EFEITO: Countdown de tempo estimado
  // ============================================
  useEffect(() => {
    if (orderStatus === "delivered" || !estimatedTime) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // Atualizar a cada 1 minuto

    return () => clearInterval(interval);
  }, [orderStatus, estimatedTime]);

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  const steps = getTimelineSteps();

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      {/* CABEÇALHO */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {orderStatus === "delivered"
            ? "✓ Pedido Entregue"
            : "Acompanhando seu pedido"}
        </h3>
        {orderNumber && (
          <p className="text-sm text-gray-600 mt-1">Pedido #{orderNumber}</p>
        )}
      </div>

      {/* TIMELINE */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            {/* ÍCONE + LINHA */}
            <div className="flex flex-col items-center">
              {/* ÍCONE */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${
                    step.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : step.status === "active"
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                {step.icon}
              </div>

              {/* LINHA CONECTORA */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-1 h-12 mt-2
                    ${
                      step.status === "completed"
                        ? "bg-green-300"
                        : "bg-gray-200"
                    }
                  `}
                />
              )}
            </div>

            {/* CONTEÚDO */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={`
                    font-semibold
                    ${
                      step.status === "completed"
                        ? "text-green-600"
                        : step.status === "active"
                        ? "text-red-600"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </h4>
                {step.status === "active" && (
                  <Clock className="w-4 h-4 text-red-600 animate-spin" />
                )}
              </div>

              <p className="text-sm text-gray-600">{step.description}</p>

              {/* TEMPO ESTIMADO */}
              {step.status === "active" && estimatedTime && (
                <p className="text-xs text-red-600 font-semibold mt-2">
                  ⏱️ Tempo estimado: {timeRemaining} min
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* RODAPÉ COM INFORMAÇÕES */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {orderStatus === "preparing" && (
          <div className="bg-blue-50 rounded-lg p-3 flex gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              Sua pizza está sendo preparada com muito cuidado! 🍕
            </p>
          </div>
        )}

        {orderStatus === "delivering" && (
          <div className="bg-purple-50 rounded-lg p-3 flex gap-3">
            <Truck className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="text-sm text-purple-900">
              <p className="font-semibold">Seu motoboy está a caminho!</p>
              <p className="text-xs mt-1">
                Tempo estimado de chegada: {timeRemaining} min
              </p>
            </div>
          </div>
        )}

        {orderStatus === "delivered" && (
          <div className="bg-green-50 rounded-lg p-3 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="text-sm text-green-900">
              <p className="font-semibold">✓ Pedido entregue com sucesso!</p>
              <p className="text-xs mt-1">
                Deixe sua avaliação para nos ajudar a melhorar
              </p>
            </div>
          </div>
        )}

        {!orderStatus && (
          <div className="bg-yellow-50 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-900">
              Carregando status do pedido...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
