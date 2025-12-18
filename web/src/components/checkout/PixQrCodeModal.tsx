// ============================================
// COMPONENTE: MODAL PIX
// ============================================

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Copy, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { toast } from "react-hot-toast";

// ============================================
// INTERFACES DE TIPOS
// ============================================

// Propriedades do componente Modal PIX
interface PixQrCodeModalProps {
  isOpen: boolean; // Controla se modal está visível
  orderId: number; // ID do pedido criado
  totalValue: number; // Valor total em reais (50.00)
  customerEmail: string; // E-mail do cliente
  isPaymentApproved: boolean; // Status de pagamento aprovado (hook useOrderStatus)
  isValidating: boolean; // Indica se está validando pagamento
  onClose: () => void; // Callback ao fechar modal
  onPaymentConfirmed: () => void; // Callback quando pagamento é confirmado
}

// Estrutura dos dados do QR Code retornado pela API
interface QrCodeData {
  qr_code: string; // Código PIX copiável
  qr_code_base64: string; // QR Code em imagem base64
  payment_id: string; // ID do pagamento
  ticket_url?: string; // URL para acompanhamento (opcional)
  status: string; // Status atual do pagamento
}

// ============================================
// COMPONENTE: PixQrCodeModal
// ============================================
export const PixQrCodeModal: React.FC<PixQrCodeModalProps> = ({
  isOpen,
  orderId,
  totalValue,
  customerEmail,
  isPaymentApproved,
  isValidating,
  onClose,
  onPaymentConfirmed,
}) => {
  // ============================================
  // ESTADOS
  // ============================================
  const [loading, setLoading] = useState(false); // Indica carregamento do QR Code
  const [qrCode, setQrCode] = useState<QrCodeData | null>(null); // Dados do QR Code
  const [error, setError] = useState<string | null>(null); // Mensagem de erro
  const [copied, setCopied] = useState(false); // Indica se código foi copiado

  // ============================================
  // FUNÇÃO: GERAR QR CODE PIX
  // ============================================
  // Responsável por chamar a API e gerar o QR Code PIX
  const generateQrCode = useCallback(async () => {
    try {
      setLoading(true); // Inicia carregamento
      setError(null); // Limpa erro anterior

      // Importação dinâmica do serviço de pagamento
      const { paymentService } = await import("@/services/payment.service");

      // Converter valor em reais para centavos
      // Exemplo: 50.00 → 5000
      const amountInCents = Math.round(totalValue * 100);

      // Chamada da API para gerar QR Code
      const response = await paymentService.generatePixQrCode(
        orderId,
        amountInCents,
        customerEmail
      );

      // Validar resposta da API
      if (!response.ok) {
        throw new Error(response.message || "Erro ao gerar QR Code");
      }

      // Salvar dados do QR Code retornado
      setQrCode(response.pix);
      toast.success("QR Code gerado com sucesso!");
    } catch (err) {
      // Tratamento de erro
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao gerar QR Code";

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Erro ao gerar PIX:", err);
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  }, [orderId, totalValue, customerEmail]);

  // ============================================
  // EFEITO: GERAR QR CODE AO ABRIR MODAL
  // ============================================
  useEffect(() => {
    if (isOpen && !qrCode) {
      generateQrCode(); // Gera QR Code ao abrir modal
    }
  }, [isOpen, qrCode, generateQrCode]);

  // ============================================
  // EFEITO: PAGAMENTO APROVADO
  // ============================================
  // Fluxo:
  // isPaymentApproved = true (hook detectou webhook)
  // Modal exibe mensagem de sucesso
  // Após 2s, executa onPaymentConfirmed()
  // Checkout fecha o modal e redireciona
  useEffect(() => {
    if (!isPaymentApproved) return;

    console.log("[PixQrCodeModal] Pagamento aprovado detectado!");
    toast.success("✓ Pagamento confirmado com sucesso!");

    // Aguarda 2 segundos para feedback visual
    const timer = setTimeout(() => {
      onPaymentConfirmed();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPaymentApproved, onPaymentConfirmed]);

  // ============================================
  // FUNÇÃO: COPIAR CÓDIGO PIX
  // ============================================
  // Copia código PIX para área de transferência
  const copyToClipboard = async () => {
    if (!qrCode?.qr_code) return;

    try {
      await navigator.clipboard.writeText(qrCode.qr_code); // Copia código
      setCopied(true); // Feedback visual
      toast.success("Código PIX copiado!");

      // Remove feedback após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar código");
      console.error("Erro ao copiar:", err);
    }
  };

  // ============================================
  // FUNÇÃO: FECHAR MODAL
  // ============================================
  const handleClose = () => {
    setQrCode(null); // Limpa QR Code
    setError(null); // Limpa erro
    setCopied(false); // Reseta estado de cópia
    onClose(); // Callback do componente pai
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  if (!isOpen) return null;

  if (isPaymentApproved) {
    return (
      <>
        {/* ============================================ */}
        {/* FUNDO ESCURO                                 */}
        {/* ============================================ */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

        {/* ============================================ */}
        {/* MODAL DE SUCESSO                             */}
        {/* ============================================ */}
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto p-6 space-y-6 text-center">
            {/* ============================================ */}
            {/* ÍCONE DE SUCESSO                             */}
            {/* ============================================ */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75" />
                <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
            </div>

            {/* ============================================ */}
            {/* MENSAGEM                                     */}
            {/* ============================================ */}
            <div>
              <h2 className="text-2xl font-bold text-green-600">
                Pagamento Confirmado! ✓
              </h2>
              <p className="text-gray-600 mt-2">
                Seu pedido foi confirmado e já está sendo preparado
              </p>
            </div>

            {/* ============================================ */}
            {/* INFORMAÇÃO                                   */}
            {/* ============================================ */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-900">
                🍕 <span className="font-semibold">Pedido confirmado!</span>
              </p>
              <p className="text-xs text-green-700 mt-1">
                Você será redirecionado para acompanhar seu pedido
              </p>
            </div>

            {/* ============================================ */}
            {/* VALOR PAGO                                   */}
            {/* ============================================ */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Total pago</p>
              <p className="text-2xl font-bold text-gray-800">
                R$ {totalValue.toFixed(2)}
              </p>
            </div>

            {/* ============================================ */}
            {/* BOTÃO DE AÇÃO                                */}
            {/* ============================================ */}
            <button
              onClick={handleClose}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Ir para Acompanhamento
            </button>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // RENDERIZAÇÃO: ESTADO NORMAL (QR CODE)
  // ============================================
  return (
    <>
      {/* ============================================ */}
      {/* FUNDO ESCURO (BACKDROP)                      */}
      {/* ============================================ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* ============================================ */}
      {/* MODAL                                        */}
      {/* ============================================ */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto p-6 space-y-6">
          {/* ============================================ */}
          {/* CABEÇALHO                                    */}
          {/* ============================================ */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Pagamento com PIX
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ============================================ */}
          {/* STATUS DE CARREGAMENTO                       */}
          {/* ============================================ */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
              <p className="text-gray-600 text-center">Gerando QR Code...</p>
            </div>
          )}

          {/* ============================================ */}
          {/* MENSAGEM DE ERRO                             */}
          {/* ============================================ */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">
                  Erro ao gerar QR Code
                </p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={generateQrCode}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* CONTEÚDO DO QR CODE                          */}
          {/* ============================================ */}
          {qrCode && !loading && !error && (
            <>
              {/* ============================================ */}
              {/* VALOR TOTAL                                  */}
              {/* ============================================ */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-600">Valor a pagar</p>
                <p className="text-3xl font-bold text-red-600">
                  R$ {totalValue.toFixed(2)}
                </p>
              </div>

              {/* ============================================ */}
              {/* QR CODE (IMAGEM)                             */}
              {/* ============================================ */}
              <div className="flex justify-center">
                {qrCode.qr_code_base64 ? (
                  <Image
                    src={`data:image/png;base64,${qrCode.qr_code_base64}`}
                    alt="QR Code PIX"
                    width={192}
                    height={192}
                    className="border-4 border-gray-200 rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-center">
                      QR Code não disponível
                    </p>
                  </div>
                )}
              </div>

              {/* ============================================ */}
              {/* INSTRUÇÕES                                   */}
              {/* ============================================ */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  Abra seu app bancário e escaneie o QR Code acima ou copie o
                  código PIX.
                </p>
              </div>

              {/* ============================================ */}
              {/* CÓDIGO PIX COPIÁVEL                          */}
              {/* ============================================ */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Código PIX (copiar e colar):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={qrCode.qr_code}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-xs font-mono break-all"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copiar código"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {copied ? "✓ Código copiado!" : "Clique para copiar"}
                </p>
              </div>

              {/* ============================================ */}
              {/* STATUS DE VALIDAÇÃO DO PAGAMENTO             */}
              {/* ============================================ */}
              {!isPaymentApproved && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">
                      Aguardando confirmação do pagamento...
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {isValidating
                        ? "Validando..."
                        : "Será automaticamente confirmado após você pagar"}
                    </p>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* LINK EXTERNO: ACOMPANHAMENTO DO PAGAMENTO    */}
              {/* ============================================ */}
              {qrCode.ticket_url && (
                <a
                  href={qrCode.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Acompanhar pagamento no MercadoPago
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
