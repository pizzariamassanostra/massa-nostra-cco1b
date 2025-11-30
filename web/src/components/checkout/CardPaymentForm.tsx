// ============================================
// COMPONENTE: CARD PAYMENT FORM
// ============================================
// Formulário de pagamento com cartão.
// Inclui campos para número do cartão, nome, validade e CVV.
// - Formata número do cartão em blocos de 4 dígitos.
// - Formata validade no padrão MM/AA.
// - Exibe ícones de segurança e cartão.
// ============================================

import React, { useState } from "react";
import { CreditCard, Lock } from "lucide-react";

interface CardPaymentFormProps {
  onSubmit: (cardData: any) => void; // Callback para envio dos dados do cartão
}

export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  onSubmit,
}) => {
  // Estados dos campos do formulário
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Formata número do cartão (agrupado em blocos de 4 dígitos)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // Remove caracteres não numéricos
    const chunks = cleaned.match(/.{1,4}/g); // Agrupa em blocos de 4
    return chunks
      ? chunks.join(" ").substring(0, 19) // Limita a 19 caracteres (16 dígitos + 3 espaços)
      : cleaned.substring(0, 16);
  };

  // Formata data de validade (MM/AA)
  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{2})(\d)/, "$1/$2") // Insere barra após 2 dígitos
      .substring(0, 5); // Limita a 5 caracteres
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
      {/* SEGURANÇA */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Lock className="w-4 h-4" />
        <span>Seus dados estão seguros</span>
      </div>

      {/* NÚMERO DO CARTÃO */}
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
          {/* Ícone de cartão */}
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* NOME NO CARTÃO */}
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

      {/* VALIDADE E CVV */}
      <div className="grid grid-cols-2 gap-4">
        {/* Validade */}
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

        {/* CVV */}
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
