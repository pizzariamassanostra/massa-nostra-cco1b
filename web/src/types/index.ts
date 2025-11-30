// ============================================
// EXPORTAÇÕES DE INTERFACES DO PRODUTO
// ============================================
// Exportar interfaces de produtos e categorias
export type {
  Product,
  ProductCategory,
  ProductVariant,
} from "@/services/product.service";

export type { Crust, Filling } from "@/services/product.service";

// ============================================
// EXPORTAÇÕES DE INTERFACES DO USUÁRIO
// ============================================
export type { CommonUser } from "@/common/interfaces/common-users.interface";

// ============================================
// EXPORTAÇÕES DE INTERFACES DO PEDIDO
// ============================================
export type {
  Order,
  OrderItem,
  CreateOrderDto,
} from "@/services/order.service";

// ============================================
// EXPORTAÇÕES DE INTERFACES DE ENDEREÇO
// ============================================
export type { Address, CreateAddressDto } from "@/services/address.service";

// ============================================
// EXPORTAÇÕES DE INTERFACES DO CARRINHO
// ============================================
export type { CartItem } from "@/contexts/CartContext";

// ============================================
// EXPORTAÇÕES DE ENUMS (VALORES CONSTANTES)
// ============================================

// Status possíveis de um pedido
export { OrderStatus } from "@/common/enum/order-status.enum";

// Métodos de pagamento disponíveis
export { PaymentMethod } from "@/common/enum/payment-method.enum";

// Status possíveis de um pagamento
export { PaymentStatus } from "@/common/enum/payment-status.enum";
