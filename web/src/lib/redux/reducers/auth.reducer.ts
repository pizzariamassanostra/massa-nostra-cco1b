// ============================================
// REDUX REDUCER: AUTH
// ============================================
// Gerencia estado de autenticação no Redux
// ============================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommonUser } from "@/common/interfaces/common-users.interface";

interface AuthState {
  user: CommonUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{ user: CommonUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<CommonUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthData, clearAuthData, updateUser } = authSlice.actions;
export default authSlice.reducer;
