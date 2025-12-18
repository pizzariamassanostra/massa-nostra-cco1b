// ============================================
// PÁGINA: PEDIDO REALIZADO
// ============================================
// Página exibida após o cliente finalizar o pedido.
// Mostra informações do pedido e status de confirmação.
// ============================================

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { orderService } from "@/services/order.service";
import { CheckCircle, Clock, MapPin, Loader } from "lucide-react";
import { toast } from "react-hot-toast";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // FUNÇÃO: CARREGAR PEDIDO
  // ============================================
  // Busca os dados do pedido na API pelo ID
  // ============================================
  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(Number(id));
      setOrder(response);
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
      toast.error("Erro ao carregar pedido");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ============================================
  // EFEITOS: EXECUTAR CARREGAMENTO AO MONTAR
  // ============================================
  // Dispara a função de carregamento quando o ID estiver disponível
  // ============================================
  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id, loadOrder]);

  // ============================================
  // FUNÇÃO: FORMATAR PREÇO
  // ============================================
  // Converte valores em centavos para moeda BRL
  // ============================================
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  // ============================================
  // ESTADO: CARREGANDO PEDIDO
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  // ============================================
  // ESTADO: PEDIDO NÃO ENCONTRADO
  // ============================================
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Pedido não encontrado</p>
      </div>
    );
  }

  // ============================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================
  return (
    <>
      {/* ============================================ */}
      {/* HEAD DA PÁGINA */}
      {/* ============================================ */}
      <Head>
        <title>Pedido Realizado - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* ============================================ */}
          {/* HEADER DE CONFIRMAÇÃO */}
          {/* ============================================ */}
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pedido Realizado com Sucesso!
            </h1>
            <p className="text-gray-600">
              Código de retirada:{" "}
              <span className="font-bold text-2xl text-red-600">
                {order.delivery_token}
              </span>
            </p>
          </div>

          {/* ============================================ */}
          {/* STATUS DO PEDIDO */}
          {/* ============================================ */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              Status do Pedido
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold">
                Aguardando confirmação de pagamento
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Tempo estimado: {order.estimated_time} minutos
              </p>
            </div>
          </div>

          {/* ============================================ */}
          {/* ENDEREÇO DE ENTREGA */}
          {/* ============================================ */}
          {order.address && (
            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-600" />
                Endereço de Entrega
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold">
                  {order.address.street}, {order.address.number}
                </p>
                {order.address.complement && (
                  <p className="text-gray-600">{order.address.complement}</p>
                )}
                <p className="text-gray-600">
                  {order.address.neighborhood}, {order.address.city}/
                  {order.address.state}
                </p>
                <p className="text-gray-600">CEP: {order.address.zip_code}</p>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* ITENS DO PEDIDO */}
          {/* ============================================ */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Itens do Pedido</h2>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-start bg-gray-50 p-3 rounded"
                >
                  <div>
                    <p className="font-semibold">
                      {item.quantity}x {item.product?.name}
                    </p>
                    {item.variant && (
                      <p className="text-sm text-gray-600">
                        {item.variant.label}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold">
                    {formatPrice(parseInt(item.unit_price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================ */}
          {/* RESUMO DE VALORES */}
          {/* ============================================ */}
          <div className="border-t pt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                {formatPrice(parseInt(order.subtotal))}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Taxa de Entrega</span>
              <span className="font-semibold">
                {formatPrice(parseInt(order.delivery_fee))}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-red-600">
                {formatPrice(parseInt(order.total))}
              </span>
            </div>
          </div>

          {/* ============================================ */}
          {/* AÇÕES FINAIS */}
          {/* ============================================ */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push("/meus-pedidos")}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
            >
              Ver Meus Pedidos
            </button>
            <button
              onClick={() => router.push("/cardapio")}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
            >
              Fazer Novo Pedido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
