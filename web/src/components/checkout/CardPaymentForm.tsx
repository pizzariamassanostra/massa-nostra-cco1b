// ============================================
// COMPONENTE: CARD PAYMENT FORM
// ============================================
// Formulário de pagamento via cartão de crédito
// Responsável por coletar e formatar dados do cartão
// ============================================

import React, { useState } from "react";
import { CreditCard, Lock } from "lucide-react";

// ============================================
// INTERFACE DE PROPS
// ============================================
// Define os dados esperados pelo componente
// ============================================
interface CardPaymentFormProps {
  onSubmit: (cardData: any) => void; // Callback para envio dos dados do cartão
}

// ============================================
// COMPONENTE: CardPaymentForm
// ============================================
export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  onSubmit,
}) => {
  // ============================================
  // ESTADOS DO FORMULÁRIO
  // ============================================
  const [cardNumber, setCardNumber] = useState(""); // Número do cartão
  const [cardName, setCardName] = useState(""); // Nome impresso no cartão
  const [expiry, setExpiry] = useState(""); // Data de validade (MM/AA)
  const [cvv, setCvv] = useState(""); // Código de segurança

  // ============================================
  // FUNÇÃO: Formatar número do cartão
  // ============================================
  // Agrupa em blocos de 4 dígitos
  // Limita a 16 dígitos (19 caracteres com espaços)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // Remove caracteres não numéricos
    const chunks = cleaned.match(/.{1,4}/g); // Agrupa em blocos de 4
    return chunks
      ? chunks.join(" ").substring(0, 19) // Limita tamanho total
      : cleaned.substring(0, 16);
  };

  // ============================================
  // FUNÇÃO: Formatar data de validade
  // ============================================
  // Formato MM/AA
  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{2})(\d)/, "$1/$2") // Insere barra após 2 dígitos
      .substring(0, 5); // Limita a 5 caracteres
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
      {/* ============================================ */}
      {/* INFORMAÇÃO DE SEGURANÇA */}
      {/* ============================================ */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Lock className="w-4 h-4" />
        <span>Seus dados estão seguros</span>
      </div>

      {/* ============================================ */}
      {/* CAMPO: NÚMERO DO CARTÃO */}
      {/* ============================================ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número do Cartão
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
            maxLength={19}
            inputMode="numeric"
          />

          {/* ÍCONE DO CARTÃO */}
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* ============================================ */}
      {/* CAMPO: NOME NO CARTÃO */}
      {/* ============================================ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome no Cartão
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value.toUpperCase())}
          placeholder="NOME COMO NO CARTÃO"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* ============================================ */}
      {/* CAMPOS: VALIDADE E CVV */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 gap-4">
        {/* ============================================ */}
        {/* CAMPO: VALIDADE */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Validade
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            maxLength={5}
            inputMode="numeric"
          />
        </div>

        {/* ============================================ */}
        {/* CAMPO: CVV */}
        {/* ============================================ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            placeholder="123"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            maxLength={4}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
};
