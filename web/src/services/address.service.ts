// ============================================
// SERVIÇO: ENDEREÇOS
// ============================================
// Responsável por gerenciar endereços de usuários,
// incluindo criação, atualização, exclusão e busca via CEP.
// ============================================

import api from "./api.service";

// Estrutura de endereço completo
export interface Address {
  id: number; // Identificador único do endereço
  common_user_id: number; // ID do usuário associado
  street: string; // Rua
  number: string; // Número
  complement: string | null; // Complemento (opcional)
  neighborhood: string; // Bairro
  city: string; // Cidade
  state: string; // Estado
  zip_code: string; // CEP
  reference: string | null; // Referência (opcional)
  is_default: boolean; // Indica se é endereço padrão
  created_at: string; // Data de criação
  updated_at: string; // Data da última atualização
}

// DTO para criação/atualização de endereço
export interface CreateAddressDto {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference?: string;
  is_default?: boolean;
}

// Estrutura de resposta da API ViaCEP
export interface ViaCepResponse {
  cep: string; // CEP consultado
  logradouro: string; // Rua
  complemento: string; // Complemento
  bairro: string; // Bairro
  localidade: string; // Cidade
  uf: string; // Estado
  erro?: boolean; // Indica erro na consulta
}

// Serviço de endereços
class AddressService {
  // Cria um novo endereço
  async create(
    data: CreateAddressDto
  ): Promise<{ ok: boolean; message: string; address: Address }> {
    const response = await api.post("/order/address", data);
    return response.data;
  }

  // Busca endereços do usuário autenticado
  async getMyAddresses(): Promise<{ ok: boolean; addresses: Address[] }> {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("Usuário não autenticado");
    }

    const user = JSON.parse(userStr);
    const response = await api.get(`/order/address/user/${user.id}`);
    return response.data;
  }

  // Atualiza um endereço existente
  async update(
    id: number,
    data: CreateAddressDto
  ): Promise<{ ok: boolean; message: string; address: Address }> {
    const response = await api.put(`/order/address/${id}`, data);
    return response.data;
  }

  // Exclui um endereço
  async delete(id: number): Promise<{ ok: boolean; message: string }> {
    const response = await api.delete(`/order/address/${id}`);
    return response.data;
  }

  // Consulta dados de endereço pelo CEP usando ViaCEP
  async searchCep(cep: string): Promise<ViaCepResponse> {
    const cleanCep = cep.replaceAll(/\D/g, "");

    if (cleanCep.length !== 8) {
      throw new Error("CEP inválido");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return data;
  }
}

// Exporta instância única do serviço
export const addressService = new AddressService();
