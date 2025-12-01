// ============================================
// ENTITY: ERRO CUSTOMIZADO
// ============================================
// Classe de erro com mensagem amigável ao usuário
// ============================================

class ApiError extends Error {
  message: string; // Mensagem técnica
  userMessage: string; // Mensagem para o usuário final
  statusCode: number; // HTTP status code

  constructor(message: string, userMessage: string, statusCode: number) {
    super(message);
    this.message = message;
    this.userMessage = userMessage;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;
