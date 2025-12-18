// ============================================
// MODELOS / INTERFACES: ENDEREÇO
// ============================================

// ============================================
// INTERFACE: Address
// ============================================
export interface Address {
  id: number; // ID do endereço
  common_user_id: number; // ID do usuário associado
  street: string; // Nome da rua
  number: string; // Número do imóvel
  complement: string | null; // Complemento (opcional)
  neighborhood: string; // Bairro
  city: string; // Cidade
  state: string; // Estado (UF)
  zip_code: string; // CEP
  reference: string | null; // Ponto de referência (opcional)
  is_default: boolean; // Indica se é o endereço principal
  created_at: string; // Data de criação
  updated_at: string; // Data da última atualização
}

// ============================================
// DTO: CreateAddressDto (Criação / Atualização)
// ============================================
export interface CreateAddressDto {
  street: string; // Nome da rua
  number: string; // Número do imóvel
  complement?: string; // Complemento (opcional)
  neighborhood: string; // Bairro
  city: string; // Cidade
  state: string; // Estado (UF)
  zip_code: string; // CEP
  reference?: string; // Ponto de referência (opcional)
  is_default?: boolean; // Define se será o endereço principal
}
