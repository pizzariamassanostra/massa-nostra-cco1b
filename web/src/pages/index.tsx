// ============================================
// PÁGINA: HOME
// ============================================

import React from "react";
import { useRouter } from "next/router";
import { ArrowRight, Pizza, Truck, Clock } from "lucide-react";
import Head from "next/head";

export default function HomePage() {
  const router = useRouter();

  // ============================================
  // NAVEGAR PARA CARDÁPIO
  // ============================================
  const handleGoToMenu = () => {
    router.push("/cardapio");
  };

  return (
    <>
      <Head>
        <title>
          Pizzaria Massa Nostra - As Melhores Pizzas de Montes Claros
        </title>
        <meta
          name="description"
          content="Peça já sua pizza!  Entrega rápida em Montes Claros.  Ingredientes frescos e sabor incomparável."
        />
      </Head>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              As Melhores Pizzas de Montes Claros!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Feitas com ingredientes frescos, massa artesanal e muito amor.
              Peça agora e receba em até 45 minutos!
            </p>
            <button
              onClick={handleGoToMenu}
              className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Ver Cardápio
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DIFERENCIAIS */}
      {/* ============================================ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher a Massa Nostra?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ingredientes Frescos */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pizza className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ingredientes Frescos</h3>
              <p className="text-gray-600">
                Usamos apenas ingredientes selecionados e de alta qualidade para
                garantir o melhor sabor.
              </p>
            </div>

            {/* Entrega Rápida */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Entrega Rápida</h3>
              <p className="text-gray-600">
                Sua pizza quentinha em até 45 minutos. Rastreie seu pedido em
                tempo real.
              </p>
            </div>

            {/* Sempre Aberto */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Horário Flexível</h3>
              <p className="text-gray-600">
                Aberto de terça a domingo, das 18h às 23h. Finais de semana até
                meia-noite!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CALL TO ACTION */}
      {/* ============================================ */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para pedir?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Navegue pelo nosso cardápio e monte sua pizza perfeita!
          </p>
          <button
            onClick={handleGoToMenu}
            className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            Ver Cardápio Completo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </>
  );
}
