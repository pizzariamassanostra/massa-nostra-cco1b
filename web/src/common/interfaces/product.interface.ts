// ============================================
// INTERFACES: PRODUTO E RELACIONADOS
// ============================================
// Define a estrutura de dados de um produto (pizza, bebida, sobremesa),
// incluindo categorias, variantes, bordas e recheios.
// Essas interfaces estão sincronizadas com a API NestJS.
// ============================================

// Produto principal
export interface Product {
  id: number;
  category_id: number; // ID da categoria associada
  name: string; // Nome do produto
  slug: string; // Identificador único (URL-friendly)
  description: string; // Descrição do produto
  image_url: string | null; // URL da imagem (opcional)
  type: "pizza" | "bebida" | "sobremesa"; // Tipo do produto
  status: "active" | "inactive"; // Status de disponibilidade
  sort_order: number; // Ordem de exibição
  created_at: string; // Data de criação
  updated_at: string; // Data de atualização

  // Relações
  category?: ProductCategory; // Categoria associada
  variants?: ProductVariant[]; // Lista de variantes (tamanhos, preços)
}

// Categoria de produto
export interface ProductCategory {
  id: number;
  name: string; // Nome da categoria
  slug: string; // Identificador único
  description: string; // Descrição da categoria
  image_url: string | null; // Imagem ilustrativa
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Variante de produto (ex.: pizza pequena, média, grande)
export interface ProductVariant {
  id: number;
  product_id: number; // ID do produto associado
  size: "small" | "medium" | "large" | null; // Tamanho da variante
  label: string; // Rótulo (ex.: "Pizza Grande")
  price: string; // Preço em decimal como string (ex: "2500.00" = R$ 25,00)
  servings: number; // Quantidade de porções
  sort_order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

// Borda da pizza
export interface Crust {
  id: number;
  name: string; // Nome da borda
  slug: string; // Identificador único
  description: string; // Descrição da borda
  price_modifier: string; // Valor adicional (ex: "800.00" = R$ 8,00)
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Recheio adicional
export interface Filling {
  id: number;
  name: string; // Nome do recheio
  slug: string; // Identificador único
  description: string; // Descrição do recheio
  price_modifier: string; // Valor adicional (ex: "500.00" = R$ 5,00)
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}
