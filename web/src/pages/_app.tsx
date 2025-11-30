// ============================================
// APP ROOT - CONFIGURAÇÃO GLOBAL
// ============================================
// Providers: Auth, Cart, Redux, React Query
// Layout condicional: Admin vs Cliente
// Toaster para notificações
// ============================================

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";

// ============================================
// REACT QUERY (Cache e requisições)
// ============================================
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ============================================
// CONTEXTS (Auth e Cart)
// ============================================
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// ============================================
// REDUX (Estado global
// ============================================
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

// ============================================
// COMPONENTES DE LAYOUT
// ============================================
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

// ============================================
// TOASTIFY (Notificações toast)
// ============================================
import { ToastContainer } from "react-toastify";

// ============================================
// NEXT.JS ROUTER
// ============================================
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// ============================================
// GUARD DE AUTENTICAÇÃO
// ============================================
import isAuth from "@/common/enum/guard/isAuth";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;

  // ============================================
  // REACT QUERY CLIENT
  // ============================================
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutos
          },
        },
      })
  );

  // ============================================
  // CONTROLE DE RENDERIZAÇÃO NO CLIENTE
  // ============================================
  // Evita erro de hidratação do Next.js
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ============================================
  // GUARD DE AUTENTICAÇÃO PARA ROTAS ADMIN
  // ============================================
  // Verifica autenticação apenas em rotas /admin
  useEffect(() => {
    if (pathname?.includes("/admin")) {
      isAuth();
    }
  }, [pathname]);

  // ============================================
  // PREVENIR RENDERIZAÇÃO NO SERVIDOR
  // ============================================
  if (!isClient) return null;

  // ============================================
  // DEFINIR PÁGINAS SEM LAYOUT PADRÃO
  // ============================================
  const noLayoutPages = ["/login", "/cadastro"];
  const isAdminPage = pathname?.startsWith("/admin");
  const isNoLayoutPage = noLayoutPages.includes(pathname || "");

  // ============================================
  // LAYOUT CONDICIONAL EXTRAÍDO
  // ============================================
  let layout;
  if (isAdminPage) {
    layout = (
      <div className="min-h-screen bg-gray-100">
        <Component {...pageProps} />
      </div>
    );
  } else if (isNoLayoutPage) {
    layout = <Component {...pageProps} />;
  } else {
    layout = (
      <div className="flex flex-col min-h-screen">
        {/* Header fixo */}
        <Header />

        {/* Conteúdo principal */}
        <main className="flex-1 bg-gray-50">
          <Component {...pageProps} />
        </main>

        {/* Botão flutuante de suporte (WhatsApp) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => window.open("https://wa.me/5538999999999", "_blank")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-110"
            aria-label="Suporte via WhatsApp"
          >
            <span className="font-bold hidden md:block">Suporte</span>
            <Image src="/whatsapp.svg" height={24} width={24} alt="WhatsApp" />
          </button>
        </div>

        {/* Footer */}
        <Footer />

        {/* Drawer do carrinho */}
        <CartDrawer />
      </div>
    );
  }

  // ============================================
  // RENDER FINAL: Providers + layout
  // ============================================
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <CartProvider>
            {/* ============================================ */}
            {/* TOAST CONTAINER (Notificações) */}
            {/* ============================================ */}
            <ToastContainer
              theme="dark"
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            {/* ============================================ */}
            {/* LAYOUT RENDERIZADO */}
            {/* ============================================ */}
            {layout}
          </CartProvider>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}
