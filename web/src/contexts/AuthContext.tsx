// ============================================
// CONTEXT: AUTENTICAÇÃO
// ============================================
// Gerencia estado global de autenticação
// Fornece funções de login, logout e dados do usuário
// ============================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { authService } from "@/services/auth.service";
import { CommonUser } from "@/common/interfaces/common-users.interface";
import { toast } from "react-hot-toast";

// ============================================
// INTERFACES
// ============================================

interface LoginDto {
  username: string;
  password: string;
}

interface RegisterDto {
  name: string;
  cpf: string;
  birth_date: string;
  phone: string;
  phone_alternative?: string;
  email: string;
  password: string;
  accept_terms: boolean;
  accept_promotions: boolean;
}

interface AuthContextData {
  user: CommonUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  updateUser: (user: CommonUser) => void;
}

// ============================================
// CRIAR CONTEXTO
// ============================================

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CommonUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // CARREGAR USUÁRIO DO LOCALSTORAGE
  // ============================================
  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (data: LoginDto) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);

      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.userMessage || "Erro ao fazer login";

      toast.error(errorMessage);
      throw error;
    }
  };

  // ============================================
  // CADASTRO
  // ============================================
  const register = async (data: RegisterDto) => {
    try {
      const response = await authService.register(data);

      setUser(response.user);

      toast.success("Cadastro realizado com sucesso!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.userMessage || "Erro ao cadastrar";

      toast.error(errorMessage);
      throw error;
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success("Logout realizado com sucesso!");
  };

  // ============================================
  // ATUALIZAR USUÁRIO
  // ============================================
  const updateUser = (updatedUser: CommonUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// HOOK PERSONALIZADO
// ============================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
};
