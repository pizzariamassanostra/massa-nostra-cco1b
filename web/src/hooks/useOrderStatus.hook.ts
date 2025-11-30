/**
 * ============================================
 * HOOK: useOrderStatus
 * ============================================
 * Verifica status do pagamento/pedido em polling
 * Intervalo: 3 segundos
 * Retorna: status, loading, error
 * ============================================
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { paymentService } from "@/services/payment.service";

/**
 * Interface de retorno do hook
 */
export interface OrderStatusHookResult {
  paymentStatus: string | null; // Status do pagamento: pending, approved, rejected, etc
  orderStatus: string | null; // Status do pedido: pending, confirmed, preparing, etc
  loading: boolean; // Está carregando?
  error: string | null; // Mensagem de erro
  isPaymentApproved: boolean; // Pagamento foi aprovado?
  isOrderConfirmed: boolean; // Pedido foi confirmado?
}

/**
 * ============================================
 * HOOK: useOrderStatus
 * ============================================
 * Monitora status do pagamento em tempo real
 *
 * Uso:
 * const { paymentStatus, isPaymentApproved, loading } = useOrderStatus(paymentId);
 *
 * Parâmetros:
 * - paymentId: UUID do pagamento (ex: '7b7f4fe5-53f6-4035-b1c8-183695bd9500')
 * - enabled: Se deve iniciar polling (default: true)
 * - interval: Intervalo de polling em ms (default: 3000 = 3 segundos)
 *
 * Retorna:
 * - paymentStatus: Status atual do pagamento
 * - orderStatus: Status do pedido associado
 * - isPaymentApproved: true se status === 'approved'
 * - isOrderConfirmed: true se orderStatus === 'confirmed'
 * - loading: true enquanto faz requisição
 * - error: Mensagem de erro se houver
 */
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

  // Config padrão
  const enabled = options?.enabled !== false;
  const interval = options?.interval || 3000; // 3 segundos

  // ============================================
  // FUNÇÃO: Verificar status do pagamento
  // ============================================
  /**
   * Faz requisição GET para /payment/find-one/:paymentId
   * Extrai status do pagamento
   * Atualiza estado local
   */
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
      // Não exibir erro em validações periódicas
      // (erro silencioso, continua tentando)
      console.debug(
        "Validação de status em andamento...",
        err instanceof Error ? err.message : "erro desconhecido"
      );
    } finally {
      // setLoading sempre false após tentativa
      setLoading(false);
    }
  }, [paymentId]);

  // ============================================
  // EFEITO: Iniciar polling quando modal abre
  // ============================================
  useEffect(() => {
    // Se desabilitado ou sem paymentId, não fazer nada
    if (!enabled || !paymentId) {
      // Limpar interval se estava rodando
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Fazer primeira verificação imediatamente
    setLoading(true);
    checkPaymentStatus();

    // Depois, verificar a cada 3 segundos
    intervalRef.current = setInterval(() => {
      checkPaymentStatus();
    }, interval);

    // Cleanup: limpar interval ao desmontar ou mudar dependências
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, paymentId, interval, checkPaymentStatus]);

  // ============================================
  // RETORNAR ESTADO DO HOOK
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
