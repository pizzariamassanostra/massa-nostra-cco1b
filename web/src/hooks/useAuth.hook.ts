// ============================================
// HOOK: USE AUTH
// ============================================
// Hook personalizado para usar AuthContext
// ============================================

import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
