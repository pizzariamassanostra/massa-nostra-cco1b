/**
 * ============================================
 * PÁGINA: CHECKOUT src/pages/checkout/index.tsx
 * ============================================
 * Fluxo de finalização de pedido
 * Seleção de endereço e forma de pagamento
 * Integração com PIX, Cartão, Dinheiro
 * ============================================
 */

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  addressService,
  Address,
  CreateAddressDto,
} from "@/services/address.service";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import {
  MapPin,
  CreditCard,
  Banknote,
  DollarSign,
  Plus,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { CardPaymentForm } from "@/components/checkout/CardPaymentForm";
import { PixQrCodeModal } from "@/components/checkout/PixQrCodeModal";
import { useSocket } from "@/hooks/useSocket.hook";

// ============================================
// TIPOS
// ============================================
type PaymentMethod = "pix" | "dinheiro" | "cartao_debito" | "cartao_credito";

// ============================================
// COMPONENTE - CheckoutPage
// ============================================
export default function CheckoutPage() {
  // ============================================
  // CONTEXTOS E ROUTER
  // ============================================
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // ============================================
  // HOOK: useSocket CHAMADO NO TOPO DO COMPONENTE
  // Isso inicializa a conexão WebSocket e retorna todos os eventos
  // ============================================
  const { isConnected, paymentApproved, clearPaymentApproved } = useSocket();

  // ============================================
  // ESTADOS - ENDEREÇO
  // ============================================
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // ============================================
  // ESTADOS - PAGAMENTO
  // ============================================
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // ESTADOS - MODAL PIX
  // ============================================
  const [showPixModal, setShowPixModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [pixPaymentPending, setPixPaymentPending] = useState(false);

  // ============================================
  // ESTADOS - NOVO ENDEREÇO
  // ============================================
  const [newAddress, setNewAddress] = useState<CreateAddressDto>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "Montes Claros",
    state: "MG",
    zip_code: "",
    reference: "",
    is_default: false,
  });

  // ============================================
  // EFEITO: WEBSOCKET - Escutar aprovação de pagamento
  // ============================================
  useEffect(() => {
    if (paymentApproved) {
      console.log("💚 Pagamento confirmado via WebSocket!", paymentApproved);

      // Mostrar mensagem de sucesso
      toast.success("Pagamento aprovado! Seu pedido está na fila da pizzaria");

      // Limpar o estado de pagamento aprovado
      clearPaymentApproved();

      // Redirecionar para "Meus Pedidos" depois de 2 segundos
      setTimeout(() => {
        router.push("/meus-pedidos");
      }, 2000);
    }
  }, [paymentApproved, clearPaymentApproved, router]);

  // ============================================
  // EFEITO: Validar autenticação
  // ============================================
  /**
   * Verifica se usuário está logado
   * Se não estiver, redireciona para login
   * Carrega endereços quando autenticado
   */
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    loadAddresses();
  }, [isAuthenticated]);

  // ============================================
  // EFEITO: Validar carrinho apenas se NÃO há pedido em processamento
  // ============================================
  /**
   * Se não há itens E não há pedido criado
   * Redireciona para cardápio
   * MAS se há pedido criado (esperando PIX), deixa aberto
   */
  useEffect(() => {
    if (items.length === 0 && !createdOrderId && !loading) {
      const timer = setTimeout(() => {
        router.push("/cardapio");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [items.length, createdOrderId, loading, router]);

  // ============================================
  // FUNÇÃO: Carregar endereços do usuário
  // ============================================
  /**
   * Busca todos os endereços cadastrados do cliente
   * Seleciona o endereço padrão automaticamente
   */
  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressService.getMyAddresses();
      setAddresses(response.addresses);

      // Selecionar endereço padrão automaticamente
      const defaultAddress = response.addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      toast.error("Erro ao carregar endereços");
    } finally {
      setLoadingAddresses(false);
    }
  };

  // ============================================
  // FUNÇÃO: Buscar CEP na API ViaCEP
  // ============================================
  /**
   * Busca dados de endereço a partir do CEP
   * Preenche automaticamente rua, bairro, cidade e estado
   */
  const handleSearchCep = async () => {
    const cleanCep = newAddress.zip_code.replaceAll(/\D/g, "");
    if (cleanCep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }
    try {
      const data = await addressService.searchCep(cleanCep);
      setNewAddress((prev) => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
      toast.success("CEP encontrado!");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("CEP não encontrado");
    }
  };

  // ============================================
  // FUNÇÃO: Criar novo endereço
  // ============================================
  /**
   * Salva novo endereço para o cliente
   * Seleciona automaticamente o novo endereço
   */
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addressService.create(newAddress);
      setAddresses((prev) => [...prev, response.address]);
      setSelectedAddress(response.address.id);
      setShowNewAddressForm(false);
      toast.success("Endereço cadastrado com sucesso!");

      // Reset formulário
      setNewAddress({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "Montes Claros",
        state: "MG",
        zip_code: "",
        reference: "",
        is_default: false,
      });
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
      toast.error("Erro ao cadastrar endereço");
    }
  };

  // ============================================
  // FUNÇÃO: FINALIZAR PEDIDO (PRINCIPAL)
  // ============================================
  /**
   * Fluxo principal de finalização do pedido
   * Diferencia entre métodos de pagamento:
   *
   * PIX:
   *   1. Cria pedido com status "pending"
   *   2. Abre modal com QR Code
   *   3. Aguarda confirmação do webhook
   *   4. useEffect acima (linha ~102) vai escutar paymentApproved via WebSocket
   *      quando webhook confirmar aprovação do PIX
   *
   * Dinheiro:
   *   1. Cria pedido com status "pending"
   *   2. Redireciona para página de pedido
   *   3. Admin confirma manualmente
   *
   * Cartão (Débito/Crédito):
   *   1. Valida dados do cartão
   *   2. Cria pedido
   *   3. Redireciona para página de pedido
   *   4. Webhook MercadoPago confirma
   */
  const handleFinishOrder = async () => {
    // ============================================
    // VALIDAÇÕES PRÉ-REQUISITO
    // ============================================
    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }
    if (!paymentMethod) {
      toast.error("Selecione uma forma de pagamento");
      return;
    }

    setLoading(true);
    try {
      // ============================================
      // PREPARAR DADOS DO PEDIDO
      // ============================================
      const orderData = {
        address_id: selectedAddress,
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          crust_id: item.crust_id || undefined,
          filling_id: item.filling_id || undefined,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod as any,
      };

      // ============================================
      // CRIAR PEDIDO
      // ============================================
      // Este passo é comum para todas as formas de pagamento
      const orderResponse = await orderService.create(orderData);

      if (!orderResponse.ok || !orderResponse.order) {
        throw new Error("Erro ao criar pedido");
      }

      const newOrderId = orderResponse.order.id;
      setCreatedOrderId(newOrderId);
      clearCart(); // Limpar carrinho após sucesso

      // ============================================
      // FLUXO ESPECÍFICO POR MÉTODO DE PAGAMENTO
      // ============================================

      // --------- PIX ---------
      if (paymentMethod === "pix") {
        // 1. Mostrar que está aguardando pagamento
        setPixPaymentPending(true);
        // 2. Abrir modal com QR Code
        setShowPixModal(true);
        // 3. Avisar usuário que precisa escanear
        toast.success("Pedido criado! Escaneie o QR Code para pagar.");
        // 4. useEffect acima (linha ~102) vai escutar paymentApproved via WebSocket
        //    quando webhook confirmar aprovação do PIX
        return;
      }

      // --------- DINHEIRO ---------
      if (paymentMethod === "dinheiro") {
        toast.success("Pedido realizado com sucesso!");
        toast("Você pode pagar em dinheiro na entrega");
        router.push(`/meus-pedidos/${newOrderId}`);
        return;
      }

      // --------- CARTÃO DE DÉBITO/CRÉDITO ---------
      if (
        paymentMethod === "cartao_debito" ||
        paymentMethod === "cartao_credito"
      ) {
        // Aqui você pode integrar com processadora de cartão
        // Por enquanto, apenas cria o pedido
        toast.success("Pedido criado! Processando pagamento com cartão...");
        router.push(`/meus-pedidos/${newOrderId}`);
        return;
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);

      // Exibir mensagem de erro amigável
      const userMessage =
        (error as any)?.response?.data?.errors?.[0]?.userMessage ||
        "Erro ao finalizar pedido";

      toast.error(userMessage);

      // Reset dos estados
      setCreatedOrderId(null);
      setPixPaymentPending(false);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNÇÃO: Callback quando PIX é confirmado
  // ============================================
  /**
   * Chamada quando webhook confirma o pagamento PIX
   * Webhook: POST /webhook/mercadopago
   * Muda status do pedido para "confirmed"
   * Gera comprovante automaticamente
   */
  const handlePixPaymentConfirmed = () => {
    setShowPixModal(false);
    setPixPaymentPending(false);
    toast.success("Pagamento confirmado! Seu pedido foi aceito.");
    router.push(`/meus-pedidos/${createdOrderId}`);
  };

  // ============================================
  // FUNÇÃO: Formatar preço para BRL
  // ============================================
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // ============================================
  // RENDERIZAR: Mostrar formulário de cartão?
  // ============================================
  const showCardForm =
    paymentMethod === "cartao_debito" || paymentMethod === "cartao_credito";

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Finalizar Pedido - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Finalizar Pedido
        </h1>

        {/* DEBUG: Mostrar status do WebSocket (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 text-xs text-gray-500">
            🔗 WebSocket: {isConnected ? "✅ Conectado" : "Desconectado"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* ============================================ */}
            {/* SEÇÃO: ENDEREÇO DE ENTREGA */}
            {/* ============================================ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-600" />
                  Endereço de Entrega
                </h2>
                {!showNewAddressForm && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-5 h-5" />
                    Novo Endereço
                  </button>
                )}
              </div>

              {/* CARREGANDO ENDEREÇOS */}
              {loadingAddresses && (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              )}

              {/* LISTAR ENDEREÇOS */}
              {!loadingAddresses && !showNewAddressForm && (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? "border-red-600 bg-red-50"
                          : "border-gray-300 hover:border-red-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="mt-1 text-red-600 focus:ring-red-500"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">
                          {address.street}, {address.number}
                        </p>
                        {address.complement && (
                          <p className="text-sm text-gray-600">
                            {address.complement}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {address.neighborhood}, {address.city}/{address.state}
                        </p>
                        <p className="text-sm text-gray-600">
                          CEP: {address.zip_code}
                        </p>
                        {address.reference && (
                          <p className="text-sm text-gray-500">
                            Ref: {address.reference}
                          </p>
                        )}
                        {address.is_default && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Padrão
                          </span>
                        )}
                      </div>
                    </label>
                  ))}

                  {addresses.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Você ainda não tem endereços cadastrados
                    </p>
                  )}
                </div>
              )}

              {/* FORMULÁRIO NOVO ENDEREÇO */}
              {showNewAddressForm && (
                <form onSubmit={handleCreateAddress} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="CEP"
                      value={newAddress.zip_code}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          zip_code: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      maxLength={9}
                    />
                    <button
                      type="button"
                      onClick={handleSearchCep}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Buscar
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Rua"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nº"
                      value={newAddress.number}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, number: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Complemento (opcional)"
                    value={newAddress.complement}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        complement: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={newAddress.neighborhood}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        neighborhood: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="UF"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      maxLength={2}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Ponto de referência (opcional)"
                    value={newAddress.reference}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        reference: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    >
                      Salvar Endereço
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ============================================ */}
            {/* SEÇÃO: FORMA DE PAGAMENTO */}
            {/* ============================================ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-red-600" />
                Forma de Pagamento
              </h2>

              <div className="space-y-3">
                {/* OPÇÃO: PIX */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "pix"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={paymentMethod === "pix"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="text-red-600 focus:ring-red-500"
                  />
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <span className="font-semibold">PIX</span>
                    <p className="text-xs text-gray-600">
                      Pagamento instantâneo pelo seu banco
                    </p>
                  </div>
                </label>

                {/* OPÇÃO: DINHEIRO */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "dinheiro"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="dinheiro"
                    checked={paymentMethod === "dinheiro"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="text-red-600 focus:ring-red-500"
                  />
                  <Banknote className="w-6 h-6 text-green-700" />
                  <div className="flex-1">
                    <span className="font-semibold">Dinheiro</span>
                    <p className="text-xs text-gray-600">Pagar na entrega</p>
                  </div>
                </label>

                {/* OPÇÃO: CARTÃO DE DÉBITO */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cartao_debito"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cartao_debito"
                    checked={paymentMethod === "cartao_debito"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="text-red-600 focus:ring-red-500"
                  />
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <span className="font-semibold">Cartão de Débito</span>
                    <p className="text-xs text-gray-600">Debitado na hora</p>
                  </div>
                </label>

                {/* OPÇÃO: CARTÃO DE CRÉDITO */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cartao_credito"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cartao_credito"
                    checked={paymentMethod === "cartao_credito"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="text-red-600 focus:ring-red-500"
                  />
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <div className="flex-1">
                    <span className="font-semibold">Cartão de Crédito</span>
                    <p className="text-xs text-gray-600">
                      Parcelado ou à vista
                    </p>
                  </div>
                </label>
              </div>

              {/* MOSTRAR FORMULÁRIO DE CARTÃO */}
              {showCardForm && (
                <CardPaymentForm onSubmit={(data) => console.log(data)} />
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* SEÇÃO: RESUMO DO PEDIDO */}
          {/* ============================================ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

              {/* ITENS DO CARRINHO */}
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* CÁLCULOS */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(total - 5)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxa de Entrega</span>
                  <span className="font-semibold">{formatPrice(5)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* BOTÃO CONFIRMAR PEDIDO */}
              <button
                onClick={handleFinishOrder}
                disabled={
                  loading ||
                  !selectedAddress ||
                  !paymentMethod ||
                  pixPaymentPending
                }
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processando..."
                  : pixPaymentPending
                  ? "Confirme o pagamento PIX"
                  : "Confirmar Pedido"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Ao confirmar, você concorda com nossos termos de uso
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL: PIX QR CODE */}
      {/* ============================================ */}
      {createdOrderId && (
        <PixQrCodeModal
          isOpen={showPixModal}
          orderId={createdOrderId}
          totalValue={total}
          customerEmail={user?.email || ""}
          onClose={() => {
            setShowPixModal(false);
            setPixPaymentPending(false);
          }}
          onPaymentConfirmed={handlePixPaymentConfirmed}
          isPaymentApproved={false}
          isValidating={false}
        />
      )}
    </>
  );
}
