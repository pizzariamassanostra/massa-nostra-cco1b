// ============================================
// FUNÇÃO: isAuth
// ============================================
// Função pura para verificar se o usuário está autenticado.
// - Pode ser usada com segurança dentro de useEffect no _app.tsx.
// - Verifica se está no ambiente do navegador.
// - Recupera o token salvo no localStorage.
// - Se não houver token, redireciona para /logout.
// - Retorna true se o token existir.
// ============================================

export default function isAuth(): boolean {
  // Garante que está no ambiente do navegador (SSR não possui window)
  if (typeof window === "undefined") return true;

  // Recupera o token salvo no localStorage
  const token = localStorage?.getItem("user_token");

  // Se não houver token, redireciona para /logout
  if (!token) {
    window.location.href = "/logout";
    return false;
  }

  // Retorna true se o token existir
  return true;
}
