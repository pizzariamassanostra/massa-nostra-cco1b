// ============================================
// PÁGINA: MEU PERFIL - Pizzaria Massa Nostra
// ============================================
// Visualização e edição dos dados do usuário
// Gerenciamento de endereços
// Exclusão de conta (LGPD)
// ============================================

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import { authService } from "@/services/auth.service";
import {
  addressService,
  Address,
  CreateAddressDto,
} from "@/services/address.service";
import { User, MapPin, Lock, Trash2, Save, Edit2, X, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatCpf } from "@/common/helpers/format-cpf";
import { formatPhone } from "@/common/helpers/format-phone";

export default function MeuPerfilPage() {
  const { isAuthenticated, user, updateUser, logout } = useAuth();
  const router = useRouter();

  // ============================================
  // ESTADOS
  // ============================================
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Dados do formulário de perfil
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone_alternative: "",
    email: "",
  });

  // Dados do formulário de novo endereço
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
  // VERIFICAR AUTENTICAÇÃO
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/meu-perfil");
      return;
    }

    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        phone_alternative: user.phone_alternative || "",
        email: user.email,
      });
    }

    loadAddresses();
  }, [isAuthenticated, user, router]);

  // ============================================
  // CARREGAR ENDEREÇOS
  // ============================================
  const loadAddresses = async () => {
    try {
      const response = await addressService.getMyAddresses();
      setAddresses(response.addresses);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    }
  };

  // ============================================
  // ATUALIZAR CAMPO DO PERFIL
  // ============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "phone" || name === "phone_alternative") {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // ============================================
  // ATUALIZAR CAMPO DO ENDEREÇO
  // ============================================
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setNewAddress((prev: CreateAddressDto) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ============================================
  // BUSCAR CEP
  // ============================================
  const handleSearchCep = async () => {
    const cleanCep = newAddress.zip_code.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }

    try {
      const data = await addressService.searchCep(cleanCep);

      setNewAddress((prev: CreateAddressDto) => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));

      toast.success("CEP encontrado!");
    } catch (error) {
      toast.error("CEP não encontrado");
    }
  };

  // ============================================
  // SALVAR PERFIL
  // ============================================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ""),
        phone_alternative:
          formData.phone_alternative.replace(/\D/g, "") || undefined,
      };

      const response = await authService.updateProfile(cleanData);
      updateUser(response.user);
      setEditMode(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SALVAR NOVO ENDEREÇO
  // ============================================
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await addressService.create(newAddress);
      setAddresses((prev) => [...prev, response.address]);
      setShowNewAddressForm(false);
      toast.success("Endereço cadastrado com sucesso!");

      // Limpar formulário
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
      toast.error("Erro ao cadastrar endereço");
    }
  };

  // ============================================
  // CANCELAR EDIÇÃO
  // ============================================
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        phone_alternative: user.phone_alternative || "",
        email: user.email,
      });
    }
    setEditMode(false);
  };

  // ============================================
  // DELETAR CONTA
  // ============================================
  const handleDeleteAccount = async () => {
    const confirmText = "DELETAR MINHA CONTA";
    const userInput = window.prompt(
      `Esta ação é IRREVERSÍVEL! Todos os seus dados serão permanentemente removidos.\n\nDigite "${confirmText}" para confirmar:`
    );

    if (userInput !== confirmText) {
      return;
    }

    try {
      await authService.deleteAccount();
      toast.success("Conta deletada com sucesso");
      logout();
    } catch (error) {
      toast.error("Erro ao deletar conta");
    }
  };

  // ============================================
  // DELETAR ENDEREÇO
  // ============================================
  const handleDeleteAddress = async (addressId: number) => {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este endereço?"
    );
    if (!confirm) return;

    try {
      await addressService.delete(addressId);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      toast.success("Endereço excluído com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir endereço");
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (!user) return null;

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Meu Perfil - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Meu Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============================================ */}
          {/* COLUNA ESQUERDA: DADOS PESSOAIS E ENDEREÇOS */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ------------------------------------------ */}
            {/* DADOS PESSOAIS */}
            {/* ------------------------------------------ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-6 h-6 text-red-600" />
                  Dados Pessoais
                </h2>

                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-5 h-5" />
                    Editar
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Campo: Nome Completo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                    required
                  />
                </div>

                {/* Campo: CPF (somente leitura) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formatCpf(user.cpf)}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    CPF não pode ser alterado
                  </p>
                </div>

                {/* Campo: Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                    required
                  />
                </div>

                {/* Campo: Telefone Alternativo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone Alternativo
                  </label>
                  <input
                    type="tel"
                    name="phone_alternative"
                    value={formData.phone_alternative}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                  />
                </div>

                {/* Campo: Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                    required
                  />
                </div>

                {/* Botões de Ação (modo edição) */}
                {editMode && (
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancelar
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* ------------------------------------------ */}
            {/* ENDEREÇOS */}
            {/* ------------------------------------------ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-600" />
                  Meus Endereços
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

              {/* Formulário de Novo Endereço */}
              {showNewAddressForm && (
                <form
                  onSubmit={handleSaveAddress}
                  className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg"
                >
                  {/* CEP com botão de busca */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="zip_code"
                      placeholder="CEP"
                      value={newAddress.zip_code}
                      onChange={handleAddressChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      maxLength={9}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSearchCep}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Buscar
                    </button>
                  </div>

                  {/* Rua e Número */}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="street"
                      placeholder="Rua"
                      value={newAddress.street}
                      onChange={handleAddressChange}
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      required
                    />
                    <input
                      type="text"
                      name="number"
                      placeholder="Nº"
                      value={newAddress.number}
                      onChange={handleAddressChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      required
                    />
                  </div>

                  {/* Complemento */}
                  <input
                    type="text"
                    name="complement"
                    placeholder="Complemento (opcional)"
                    value={newAddress.complement}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />

                  {/* Bairro */}
                  <input
                    type="text"
                    name="neighborhood"
                    placeholder="Bairro"
                    value={newAddress.neighborhood}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    required
                  />

                  {/* Cidade e Estado */}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="city"
                      placeholder="Cidade"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="UF"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      maxLength={2}
                      required
                    />
                  </div>

                  {/* Ponto de Referência */}
                  <input
                    type="text"
                    name="reference"
                    placeholder="Ponto de referência (opcional)"
                    value={newAddress.reference}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />

                  {/* Checkbox: Endereço Padrão */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_default"
                      id="is_default"
                      checked={newAddress.is_default}
                      onChange={handleAddressChange}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="is_default"
                      className="text-sm text-gray-700"
                    >
                      Definir como endereço padrão
                    </label>
                  </div>

                  {/* Botões de Ação */}
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
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Endereços */}
              {addresses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Você ainda não tem endereços cadastrados
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gray-300 rounded-lg p-4 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
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
                          <p className="text-sm text-gray-500 italic">
                            Ref: {address.reference}
                          </p>
                        )}
                        {address.is_default && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Padrão
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700 ml-4"
                        title="Excluir endereço"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* COLUNA DIREITA: AÇÕES SENSÍVEIS */}
          {/* ============================================ */}
          <div className="lg:col-span-1 space-y-6">
            {/* SEGURANÇA */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Segurança
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Para alterar sua senha, entre em contato com o suporte
              </p>
              <button
                onClick={() => router.push("/suporte")}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Contatar Suporte
              </button>
            </div>

            {/* ZONA DE PERIGO */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-800">
                <Trash2 className="w-5 h-5" />
                Zona de Perigo
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Ao excluir sua conta, todos os seus dados serão permanentemente
                removidos. Esta ação não pode ser desfeita.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir Minha Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
