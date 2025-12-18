// ============================================
// HOOKS: PRODUTOS
// ============================================
// Hooks responsáveis por buscar produtos,
// categorias, bordas e recheios usando React Query.
// Inclui cache automático e revalidação.
// ============================================

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

// ============================================
// HOOK: LISTAR TODOS OS PRODUTOS
// ============================================
// Retorna lista completa de produtos
// com cache e staleTime configurado
// ============================================
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productService.getAll();
      return response.products; // Retorna apenas o array de produtos
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// ============================================
// HOOK: BUSCAR PRODUTO POR ID
// ============================================
// Retorna dados de um produto específico
// baseado no ID informado
// ============================================
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await productService.getById(id);
      return response.product; // Retorna apenas o produto
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// ============================================
// HOOK: LISTAR CATEGORIAS
// ============================================
// Busca todas as categorias de produtos
// ============================================
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await productService.getCategories();
      return response.categories;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ============================================
// HOOK: LISTAR BORDAS
// ============================================
// Busca opções de bordas disponíveis
// ============================================
export const useCrusts = () => {
  return useQuery({
    queryKey: ["crusts"],
    queryFn: async () => {
      const response = await productService.getCrusts();
      return response.crusts;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ============================================
// HOOK: LISTAR RECHEIOS
// ============================================
// Busca opções de recheios disponíveis
// ============================================
export const useFillings = () => {
  return useQuery({
    queryKey: ["fillings"],
    queryFn: async () => {
      const response = await productService.getFillings();
      return response.fillings;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};
