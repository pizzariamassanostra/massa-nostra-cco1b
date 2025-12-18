// ============================================
// HOOK: USER ORDEM STATUS
// ============================================
// Verifica status do pagamento e do pedido via polling.
// Utilizado para acompanhar pagamentos Pix em tempo real.
// Intervalo padrão: 3 segundos.
// ============================================

import { useState, useEffect, useCallback, useRef } from "react";
import { paymentService } from "@/services/payment.service";

// ============================================
// INTERFACES / TIPOS
// ============================================

export interface OrderStatusHookResult {
  paymentStatus: string | null; // Status do pagamento: pendente, aprovado, rejeitado, etc
  orderStatus: string | null; // Status do pedido: pendente, confirmado, preparando, etc
  loading: boolean; // Indica se está carregando
  error: string | null; // Mensagem de erro
  isPaymentApproved: boolean; // Pagamento foi aprovado?
  isOrderConfirmed: boolean; // Pedido foi confirmado?
}

// ============================================
// HOOK PRINCIPAL
// ============================================
// Responsável por iniciar polling do pagamento,
// atualizar estados e expor status ao frontend.
// ============================================

export const useOrderStatus = (
  paymentId: string | null,
  options?: {
    enabled?: boolean;
    interval?: number;
  }
): OrderStatusHookResult => {
  // ============================================
  // ESTADOS
  // ============================================

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useRef para armazenar timer (evita múltiplos intervals)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // CONFIGURAÇÕES
  // ============================================

  const enabled = options?.enabled !== false; // Define se polling está ativo
  const interval = options?.interval || 3000; // Intervalo do polling em ms

  // ============================================
  // FUNÇÃO: VERIFICAR STATUS DO PAGAMENTO
  // ============================================

  const checkPaymentStatus = useCallback(async () => {
    // Validação: paymentId não pode ser null
    if (!paymentId) {
      setError("ID do pagamento não definido");
      return;
    }

    try {
      // Limpar erro anterior
      setError(null);

      // Fazer requisição (sem mostrar loading em validações periódicas)
      const response = await paymentService.validatePixPayment(paymentId);

      // Validar resposta
      if (!response.ok || !response.data) {
        throw new Error(response.message || "Erro ao buscar status");
      }

      // Extrair status
      const newPaymentStatus = response.data.status;
      const newOrderStatus = response.data.order?.status || null;

      // Atualizar estados
      setPaymentStatus(newPaymentStatus);
      if (newOrderStatus) {
        setOrderStatus(newOrderStatus);
      }

      // Log para debug
      console.debug(
        `[useOrderStatus] Status: ${newPaymentStatus} | Order: ${newOrderStatus}`
      );
    } catch (err) {
      // Erro silencioso durante polling
      console.debug(
        "Validação de status em andamento...",
        err instanceof Error ? err.message : "erro desconhecido"
      );
    } finally {
      // Garantir loading como false após tentativa
      setLoading(false);
    }
  }, [paymentId]);

  // ============================================
  // EFEITO: INICIAR POLLING QUANDO ATIVO
  // ============================================

  useEffect(() => {
    // Se desabilitado ou sem paymentId, não iniciar polling
    if (!enabled || !paymentId) {
      // Limpar interval se existir
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Primeira verificação imediata
    setLoading(true);
    checkPaymentStatus();

    // Verificação periódica
    intervalRef.current = setInterval(() => {
      checkPaymentStatus();
    }, interval);

    // Cleanup: limpar interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, paymentId, interval, checkPaymentStatus]);

  // ============================================
  // EXPORTAÇÃO DO ESTADO DO HOOK
  // ============================================

  return {
    paymentStatus,
    orderStatus,
    loading,
    error,
    isPaymentApproved: paymentStatus === "approved",
    isOrderConfirmed: orderStatus === "confirmed",
  };
};
