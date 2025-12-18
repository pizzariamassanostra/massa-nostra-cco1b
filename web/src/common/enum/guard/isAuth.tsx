// ============================================
// FUNÇÃO: Verificação de Autenticação
// ============================================

export default function isAuth(): boolean {
  // Verifica se está no ambiente do navegador (SSR não possui window)
  if (typeof window === "undefined") return true;

  // Recupera o token salvo no localStorage
  const token = localStorage?.getItem("user_token");

  // Se não houver token, redireciona o usuário para /logout
  if (!token) {
    window.location.href = "/logout";
    return false;
  }

  // Retorna true quando o token existir (usuário autenticado)
  return true;
}
