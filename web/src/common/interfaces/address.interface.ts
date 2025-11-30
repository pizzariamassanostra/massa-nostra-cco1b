// ============================================
// INTERFACE: ENDEREÇO
// ============================================
// Define a estrutura de um endereço de entrega
// Sincronizado com a API NestJS
// ============================================

export interface Address {
  id: number;
  common_user_id: number;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// DTO para criar/atualizar endereço
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
