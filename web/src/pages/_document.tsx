// ============================================
// DOCUMENTO CUSTOMIZADO: NEXT.JS
// ============================================
// Define a estrutura base do HTML para toda aplicação Next.js.
// Permite configurar idioma, head global e body customizado.
// ============================================

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // Define idioma padrão da aplicação
    <Html lang="en">
      {/* ============================================ */}
      {/* HEAD GLOBAL */}
      {/* ============================================ */}
      <Head />

      {/* ============================================ */}
      {/* OBSERVAÇÃO IMPORTANTE */}
      {/* ============================================ */}
      {/* <title> não deve ser usado aqui.
          O título deve ser definido em cada página ou via <Head> do Next.js */}
      <title className="font-bold">Pizzaria Massa Nostra</title>

      {/* ============================================ */}
      {/* BODY GLOBAL */}
      {/* ============================================ */}
      <body className="dark overflow-x-clip">
        {/* Renderiza o conteúdo principal da página */}
        <Main />

        {/* Scripts necessários para funcionamento do Next.js */}
        <NextScript />
      </body>
    </Html>
  );
}
