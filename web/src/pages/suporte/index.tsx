// ============================================
// PÁGINA: SUPORTE
// ============================================
// Página de suporte da Pizzaria Massa Nostra.
// Inclui canais de contato (WhatsApp, Telefone, E-mail, Endereço)
// e seção de Perguntas Frequentes (FAQ).
// ============================================

import Head from "next/head";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function SuportePage() {
  return (
    <>
      {/* Head da página com título */}
      <Head>
        <title>Suporte - Pizzaria Massa Nostra</title>
      </Head>

      {/* Container principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Título da página */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Central de Suporte
        </h1>

        {/* Grid com canais de contato */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Image
                  src="/whatsapp.svg"
                  alt="WhatsApp"
                  width={32}
                  height={32}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">WhatsApp</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Fale conosco pelo WhatsApp para atendimento rápido
            </p>
            <a
              href="https://wa.me/5538999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Abrir WhatsApp
            </a>
          </div>

          {/* Telefone */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Telefone</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Ligue para fazer seu pedido ou tirar dúvidas
            </p>
            <a
              href="tel:+5538999999999"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              (38) 99999-9999
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Mail className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">E-mail</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Envie suas dúvidas ou sugestões por e-mail
            </p>
            <a
              href="mailto:contato@pizzariamassanostra.com.br"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Enviar E-mail
            </a>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <MapPin className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Endereço</h2>
            </div>
            <p className="text-gray-600 mb-2">Rua das Pizzas, 123 - Centro</p>
            <p className="text-gray-600 mb-4">Montes Claros - MG</p>
            <p className="text-gray-600">
              <strong>Horário:</strong> Seg-Dom, 18h-23h
            </p>
          </div>
        </div>

        {/* FAQ - Perguntas Frequentes */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {/* Tempo de entrega */}
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-bold text-lg cursor-pointer text-gray-800">
                Qual o tempo de entrega?
              </summary>
              <p className="text-gray-600 mt-4">
                O tempo médio de entrega é de 40 a 60 minutos, dependendo da sua
                localização e do movimento do dia.
              </p>
            </details>

            {/* Valor mínimo */}
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-bold text-lg cursor-pointer text-gray-800">
                Qual o valor mínimo do pedido?
              </summary>
              <p className="text-gray-600 mt-4">
                Não temos valor mínimo! Você pode pedir a quantidade que
                desejar.
              </p>
            </details>

            {/* Formas de pagamento */}
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-bold text-lg cursor-pointer text-gray-800">
                Como posso pagar?
              </summary>
              <p className="text-gray-600 mt-4">
                Aceitamos PIX, dinheiro, cartão de débito e cartão de crédito.
              </p>
            </details>

            {/* Cancelamento */}
            <details className="bg-white rounded-lg shadow-md p-6">
              <summary className="font-bold text-lg cursor-pointer text-gray-800">
                Posso cancelar meu pedido?
              </summary>
              <p className="text-gray-600 mt-4">
                Sim, você pode cancelar seu pedido enquanto ele estiver com
                status &quot;Pendente&quot; ou &quot;Confirmado&quot; através da
                página &quot;Meus Pedidos&quot;.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
