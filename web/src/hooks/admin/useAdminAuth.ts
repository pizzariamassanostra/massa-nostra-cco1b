// ============================================
// HOOK: USE ADMIN AUTH
// ============================================
// Hook temporário para controle de acesso ao admin
// Qualquer usuário autenticado pode acessar
// ============================================

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

// ============================================
// HOOK PRINCIPAL
// ============================================
export const useAdminAuth = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // ============================================
  // EFEITO: Verificar autenticação do usuário
  // ============================================
  useEffect(() => {
    if (loading) return;

    // Só verifica se está autenticado
    if (!isAuthenticated) {
      router.push("/login? redirect=/admin");
      return;
    }

    // Verificação de role desabilitada temporariamente
    // const userWithRole = user as any;
    // const isAdmin = userWithRole?.roles?.some(...)
    // if (! isAdmin) {
    //   router.push("/");
    // }
  }, [isAuthenticated, loading]);

  // ============================================
  // RETORNO DO HOOK
  // ============================================
  return {
    isAdmin: isAuthenticated, // Qualquer autenticado é "admin" temporariamente
    user,
    loading,
  };
};
