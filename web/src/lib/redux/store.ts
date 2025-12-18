// ============================================
// REDUX STORE
// ============================================
// Configuração central da store Redux da aplicação.
// Responsável por registrar reducers globais
// e exportar tipos e hooks tipados.
// ============================================

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/auth.reducer";
import cartReducer from "./reducers/cart.reducer";

// ============================================
// CONFIGURAÇÃO DA STORE
// ============================================
// Registro dos reducers globais da aplicação
// ============================================
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

// ============================================
// TIPOS GLOBAIS
// ============================================
// Tipos auxiliares para tipagem do Redux
// ============================================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ============================================
// HOOKS TIPADOS
// ============================================
// Hooks personalizados para uso do Redux
// com tipagem automática no projeto
// ============================================
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
