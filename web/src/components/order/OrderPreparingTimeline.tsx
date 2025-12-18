// ============================================
// COMPONENTE: ORDER PREPARING TIMELINE
// ============================================
// Exibe a linha do tempo do preparo do pedido.
// Mostra etapas, status visual e tempo estimado.
// Estados possíveis:
// - confirmed   → Pedido recebido
// - preparing   → Em preparação
// - ready       → Pronto para saída
// - delivering  → Saiu para entrega
// - delivered   → Entregue
// ============================================

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Truck,
  MapPin,
  AlertCircle,
} from "lucide-react";

// ============================================
// INTERFACE DE PROPS
// ============================================
interface OrderPreparingTimelineProps {
  orderStatus: string | null; // Status atual do pedido
  estimatedTime?: number; // Tempo estimado em minutos
  orderNumber?: number; // Número do pedido
  isLoading?: boolean; // Indica estado de carregamento
}

// ============================================
// INTERFACE DE ETAPA DA TIMELINE
// ============================================
interface TimelineStep {
  id: string; // Identificador da etapa
  label: string; // Título da etapa
  description: string; // Descrição da etapa
  icon: React.ReactNode; // Ícone representativo
  status: "completed" | "active" | "pending"; // Status visual da etapa
}

// ============================================
// COMPONENTE
// ============================================
export const OrderPreparingTimeline: React.FC<OrderPreparingTimelineProps> = ({
  orderStatus = "confirmed",
  estimatedTime = 30,
  orderNumber,
  isLoading = false,
}) => {
  // ============================================
  // ESTADO LOCAL
  // ============================================
  // Controla o tempo restante estimado do pedido
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);

  // ============================================
  // FUNÇÃO: DETERMINAR STATUS DA ETAPA
  // ============================================
  // Retorna o status da etapa baseado em uma condição
  const getStepStatus = (
    condition: boolean,
    statusIfTrue: "completed" | "active" | "pending",
    statusIfFalse: "completed" | "active" | "pending"
  ): "completed" | "active" | "pending" => {
    return condition ? statusIfTrue : statusIfFalse;
  };

  // ============================================
  // FUNÇÃO: MAPEAR STATUS DO PEDIDO PARA ETAPAS
  // ============================================
  // Converte o status do pedido em uma lista de etapas
  // com seus respectivos estados visuais
  const getTimelineSteps = (): TimelineStep[] => {
    const baseSteps: TimelineStep[] = [
      {
        id: "received",
        label: "Pedido Recebido",
        description: "Seu pedido foi confirmado",
        icon: <CheckCircle className="w-6 h-6" />,
        status: "completed", // Sempre concluído após criação do pedido
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
  // EFEITO: CONTAGEM REGRESSIVA DO TEMPO ESTIMADO
  // ============================================
  useEffect(() => {
    // Não executa se pedido já foi entregue
    if (orderStatus === "delivered" || !estimatedTime) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0)); // Evita valores negativos
    }, 60000); // Atualiza a cada 1 minuto

    return () => clearInterval(interval); // Limpa intervalo ao desmontar
  }, [orderStatus, estimatedTime]);

  // ============================================
  // DADOS DE RENDERIZAÇÃO
  // ============================================
  const steps = getTimelineSteps();
  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      {/* CABEÇALHO DO COMPONENTE */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {orderStatus === "delivered"
            ? "✓ Pedido Entregue"
            : "Acompanhando seu pedido"}
          {/* Título padrão durante o progresso */}
        </h3>

        {/* Número do pedido (opcional) */}
        {orderNumber && (
          <p className="text-sm text-gray-600 mt-1">Pedido #{orderNumber}</p>
        )}
      </div>
      {/* TIMELINE DO PEDIDO */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            {/* ÍCONE E LINHA
            CONECTORA */}
            <div className="flex flex-col items-center">
              {/* ÍCONE DA ETAPA */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${
                    step.status === "completed"
                      ? "bg-green-100 text-green-600" // Etapa concluída
                      : step.status === "active"
                      ? "bg-red-100 text-red-600 animate-pulse" // Etapa atual
                      : "bg-gray-100 text-gray-400" // Etapa pendente
                  }
                `}
              >
                {step.icon}
              </div>

              {/* Linha conectora entre etapas */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-1 h-12 mt-2
                    ${
                      step.status === "completed"
                        ? "bg-green-300" // Linha concluída
                        : "bg-gray-200" // Linha pendente
                    }
                  `}
                />
              )}
            </div>
            {/* CONTEÚDO DA ETAPA */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-1">
                {/* Título da etapa */}
                <h4
                  className={`
                    font-semibold
                    ${
                      step.status === "completed"
                        ? "text-green-600" // Texto concluído
                        : step.status === "active"
                        ? "text-red-600" // Texto ativo
                        : "text-gray-400" // Texto pendente
                    }
                  `}
                >
                  {step.label}
                </h4>

                {/* Indicador visual de etapa ativa */}
                {step.status === "active" && (
                  <Clock className="w-4 h-4 text-red-600 animate-spin" />
                )}
              </div>

              {/* Descrição da etapa */}
              <p className="text-sm text-gray-600">{step.description}</p>

              {/* Tempo estimado da etapa ativa */}
              {step.status === "active" && estimatedTime && (
                <p className="text-xs text-red-600 font-semibold mt-2">
                  ⏱️ Tempo estimado: {timeRemaining} min
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* RODAPÉ COM MENSAGENS CONTEXTUAIS */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {/* Pedido em preparação */}
        {orderStatus === "preparing" && (
          <div className="bg-blue-50 rounded-lg p-3 flex gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              Sua pizza está sendo preparada com muito cuidado! 🍕
            </p>
          </div>
        )}

        {/* Pedido saiu para entrega */}
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

        {/* Pedido entregue */}
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

        {/* Estado de carregamento */}
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
