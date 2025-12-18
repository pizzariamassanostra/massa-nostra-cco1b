// ============================================
// ENTITY: API ERROR
// ============================================
// Classe de erro customizada
// Utilizada para retornar mensagens técnicas
// e mensagens amigáveis ao usuário final
// ============================================

// ============================================
// CLASSE: ApiError
// ============================================
class ApiError extends Error {
  message: string; // Mensagem técnica (log / debug)
  userMessage: string; // Mensagem exibida ao usuário final
  statusCode: number; // Código HTTP do erro

  // ============================================
  // CONSTRUTOR
  // ============================================
  constructor(message: string, userMessage: string, statusCode: number) {
    super(message); // Inicializa Error padrão
    this.message = message; // Define mensagem técnica
    this.userMessage = userMessage; // Define mensagem amigável
    this.statusCode = statusCode; // Define status HTTP

    // Garante o prototype correto ao estender Error
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// ============================================
// EXPORTAÇÃO
// ============================================
export default ApiError;
