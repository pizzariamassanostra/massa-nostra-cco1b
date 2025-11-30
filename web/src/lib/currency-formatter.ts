// ============================================
// UTILITÁRIO: FORMATADOR DE MOEDA (REAL - BRL)
// ============================================
// Cria um formatador para valores monetários em Real (BRL),
// utilizando a localidade brasileira "pt-BR".
// Exibe valores com símbolo de moeda e casas decimais.
// ============================================

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency", // Define estilo como moeda
  currency: "BRL", // Define moeda como Real brasileiro

  // Opções comentadas para arredondar valores a números inteiros:
  // minimumFractionDigits: 0, // Ex.: 2500.10 → R$ 2.500,1
  // maximumFractionDigits: 0, // Ex.: 2500.99 → R$ 2.501
});

// Exporta instância do formatador para uso em toda aplicação
export default currencyFormatter;
