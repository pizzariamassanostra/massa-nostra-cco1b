// ============================================
// REDUX REDUCER: AUTH
// ============================================
// Gerencia o estado de autenticação do usuário,
// incluindo dados do usuário, token e status de login.
// ============================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommonUser } from "@/common/interfaces/common-users.interface";

// ============================================
// INTERFACE DE ESTADO
// ============================================
// Estrutura do estado de autenticação no Redux
// ============================================
interface AuthState {
  user: CommonUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ============================================
// ESTADO INICIAL
// ============================================
// Estado padrão antes do usuário autenticar
// ============================================
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// ============================================
// SLICE DO REDUX
// ============================================
// Define reducers e actions relacionadas à autenticação
// ============================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ============================================
    // DEFINIR DADOS DE AUTENTICAÇÃO
    // ============================================
    // Armazena usuário e token após login bem-sucedido
    // ============================================
    setAuthData: (
      state,
      action: PayloadAction<{ user: CommonUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    // ============================================
    // LIMPAR DADOS DE AUTENTICAÇÃO
    // ============================================
    // Usado no logout para resetar o estado
    // ============================================
    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    // ============================================
    // ATUALIZAR DADOS DO USUÁRIO
    // ============================================
    // Atualiza apenas as informações do usuário logado
    // ============================================
    updateUser: (state, action: PayloadAction<CommonUser>) => {
      state.user = action.payload;
    },
  },
});

// ============================================
// EXPORTAÇÕES
// ============================================
// Actions e reducer de autenticação
// ============================================
export const { setAuthData, clearAuthData, updateUser } = authSlice.actions;
export default authSlice.reducer;
