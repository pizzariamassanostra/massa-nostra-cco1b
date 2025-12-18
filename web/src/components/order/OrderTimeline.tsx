// ============================================
// COMPONENTE: LINHA DO TEMPO DO PEDIDO
// ============================================
// Exibe uma timeline visual representando o progresso do pedido.
// Marca etapas concluídas, etapa atual e próximas etapas.
// Trata estado especial de pedido cancelado.
// ============================================

import React from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Utensils,
  Truck,
  Home,
  XCircle,
} from "lucide-react";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface OrderTimelineProps {
  status: string; // Status atual do pedido
}

// ============================================
// COMPONENTE
// ============================================
const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  // ============================================
  // DEFINIÇÃO DAS ETAPAS DO PEDIDO
  // ============================================
  // Ordem lógica do fluxo de um pedido
  const steps = [
    {
      key: "pending", // Pedido criado
      label: "Pedido Recebido",
      icon: Clock,
    },
    {
      key: "confirmed", // Pedido confirmado pelo sistema/restaurante
      label: "Confirmado",
      icon: CheckCircle,
    },
    {
      key: "preparing", // Pedido em preparo
      label: "Em Preparação",
      icon: Utensils,
    },
    {
      key: "on_delivery", // Pedido saiu para entrega
      label: "Saiu para Entrega",
      icon: Truck,
    },
    {
      key: "delivered", // Pedido entregue
      label: "Entregue",
      icon: Home,
    },
  ];

  // ============================================
  // VERIFICAR SE UMA ETAPA ESTÁ CONCLUÍDA
  // ============================================
  // Uma etapa é considerada concluída se estiver
  // antes ou igual ao status atual do pedido
  const isStepComplete = (stepKey: string): boolean => {
    const statusOrder = [
      "pending",
      "confirmed",
      "preparing",
      "on_delivery",
      "delivered",
    ];

    const currentIndex = statusOrder.indexOf(status); // Índice do status atual
    const stepIndex = statusOrder.indexOf(stepKey); // Índice da etapa avaliada

    return stepIndex <= currentIndex;
  };

  // ============================================
  // VERIFICAR SE É A ETAPA ATUAL
  // ============================================
  const isCurrentStep = (stepKey: string): boolean => {
    return stepKey === status;
  };

  // ============================================
  // ESTADO ESPECIAL: PEDIDO CANCELADO
  // ============================================
  if (status === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-800 mb-1">
          Pedido Cancelado
        </h3>
        <p className="text-sm text-red-600">
          Este pedido foi cancelado e não será entregue.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ============================================ */}
      {/* TÍTULO */}
      {/* ============================================ */}
      <h3 className="text-lg font-bold mb-6">Status do Pedido</h3>

      {/* ============================================ */}
      {/* TIMELINE */}
      {/* ============================================ */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon; // Ícone da etapa
          const isComplete = isStepComplete(step.key); // Etapa concluída
          const isCurrent = isCurrentStep(step.key); // Etapa atual

          return (
            <div key={step.key} className="flex items-start gap-4">
              {/* ============================================ */}
              {/* ÍCONE E LINHA CONECTORA */}
              {/* ============================================ */}
              <div className="flex flex-col items-center">
                {/* Ícone da etapa */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete
                      ? "bg-green-500 text-white" // Etapa concluída
                      : isCurrent
                      ? "bg-blue-500 text-white animate-pulse" // Etapa atual
                      : "bg-gray-200 text-gray-400" // Etapa futura
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Linha conectora entre etapas */}
                {/* Não renderiza no último item */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      isComplete ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* ============================================ */}
              {/* LABEL E STATUS */}
              {/* ============================================ */}
              <div className="flex-1 pt-2">
                <p
                  className={`font-semibold ${
                    isComplete
                      ? "text-green-700" // Etapa concluída
                      : isCurrent
                      ? "text-blue-700" // Etapa atual
                      : "text-gray-400" // Etapa futura
                  }`}
                >
                  {step.label}
                </p>

                {/* Mensagem para etapa atual */}
                {isCurrent && (
                  <p className="text-sm text-blue-600 mt-1">
                    Seu pedido está nesta etapa agora
                  </p>
                )}

                {/* Mensagem para etapas concluídas */}
                {isComplete && !isCurrent && (
                  <p className="text-sm text-green-600 mt-1">✓ Concluído</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// EXPORTAÇÃO
// ============================================
export default OrderTimeline;
