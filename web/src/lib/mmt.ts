// ============================================
// CONFIGURAÇÃO: MOMENT-TIMEZONE
// ============================================
// Define configuração padrão de fuso horário para a aplicação.
// Utiliza biblioteca moment-timezone e fixa timezone em "America/Sao_Paulo".
// ============================================

import moment from "moment-timezone";

// Alias para facilitar uso do moment
const mmt = moment;

// Define fuso horário padrão como São Paulo (Brasil)
moment.tz.setDefault("America/Sao_Paulo");

// Exporta instância configurada
export default mmt;
