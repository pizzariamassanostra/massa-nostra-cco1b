// ============================================
// COMPONENTE: LINHA DO TEMPO DO PEDIDO
// ============================================
// Exibe timeline visual do progresso do pedido
// Marca etapas concluídas e próximas
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

interface OrderTimelineProps {
  status: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  // ============================================
  // DEFINIR ETAPAS
  // ============================================
  const steps = [
    {
      key: "pending",
      label: "Pedido Recebido",
      icon: Clock,
    },
    {
      key: "confirmed",
      label: "Confirmado",
      icon: CheckCircle,
    },
    {
      key: "preparing",
      label: "Em Preparação",
      icon: Utensils,
    },
    {
      key: "on_delivery",
      label: "Saiu para Entrega",
      icon: Truck,
    },
    {
      key: "delivered",
      label: "Entregue",
      icon: Home,
    },
  ];

  // ============================================
  // VERIFICAR SE ETAPA ESTÁ COMPLETA
  // ============================================
  const isStepComplete = (stepKey: string): boolean => {
    const statusOrder = [
      "pending",
      "confirmed",
      "preparing",
      "on_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepKey);
    return stepIndex <= currentIndex;
  };

  // ============================================
  // VERIFICAR SE É ETAPA ATUAL
  // ============================================
  const isCurrentStep = (stepKey: string): boolean => {
    return stepKey === status;
  };

  // Se pedido foi cancelado
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
      <h3 className="text-lg font-bold mb-6">Status do Pedido</h3>

      {/* ============================================ */}
      {/* TIMELINE */}
      {/* ============================================ */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = isStepComplete(step.key);
          const isCurrent = isCurrentStep(step.key);

          return (
            <div key={step.key} className="flex items-start gap-4">
              {/* ============================================ */}
              {/* ÍCONE E LINHA */}
              {/* ============================================ */}
              <div className="flex flex-col items-center">
                {/* Ícone */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 text-white animate-pulse"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Linha conectora (não mostrar no último item) */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      isComplete ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* ============================================ */}
              {/* LABEL */}
              {/* ============================================ */}
              <div className="flex-1 pt-2">
                <p
                  className={`font-semibold ${
                    isComplete
                      ? "text-green-700"
                      : isCurrent
                      ? "text-blue-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                {/* Mensagem de progresso na etapa atual */}
                {isCurrent && (
                  <p className="text-sm text-blue-600 mt-1">
                    Seu pedido está nesta etapa agora
                  </p>
                )}

                {/* Marca de conclusão */}
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

export default OrderTimeline;
