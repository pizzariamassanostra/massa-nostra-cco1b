// ============================================
// PÁGINA: EDITAR PRODUTO (ADMIN)
// ============================================
// Formulário de edição de produto
// Atualização de dados e imagem
// ============================================

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import ProductForm, {
  ProductFormData,
} from "@/components/admin/Products/ProductForm";
import LoadingSpinner from "@/components/admin/Common/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api.service";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function EditarProdutoPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  // ============================================
  // BUSCAR PRODUTO
  // ============================================
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get(`/product/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // ============================================
  // BUSCAR CATEGORIAS
  // ============================================
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/product-category");
      return response.data;
    },
  });

  // ============================================
  // MUTATION — ATUALIZAR PRODUTO
  // ============================================
  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category_id", String(data.category_id));
      formData.append("base_price", String(data.base_price * 100)); // centavos
      formData.append("is_active", String(data.is_active));

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await api.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/produtos");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar produto"
      );
    },
  });

  // ============================================
  // LOADING — PRODUTO
  // ============================================
  if (loadingProduct) {
    return (
      <AdminLayout title="Editar Produto">
        <LoadingSpinner size="lg" text="Carregando produto..." />
      </AdminLayout>
    );
  }

  // ============================================
  // ERRO — PRODUTO NÃO ENCONTRADO
  // ============================================
  if (!product) {
    return (
      <AdminLayout title="Editar Produto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">Produto não encontrado</p>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // DADOS DERIVADOS
  // ============================================
  const categories = categoriesData?.categories || [];

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <Head>
        <title>Editar {product.name} - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title={`Editar: ${product.name}`}>
        {/* ============================================ */}
        {/* LINK VOLTAR */}
        {/* ============================================ */}
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Produtos
        </Link>

        {/* ============================================ */}
        {/* FORMULÁRIO */}
        {/* ============================================ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm
            initialData={{
              name: product.name,
              description: product.description,
              category_id: product.category_id,
              base_price: product.base_price / 100,
              is_active: product.is_active,
            }}
            currentImage={product.image_url}
            categories={categories}
            onSubmit={(data) => updateMutation.mutate(data)}
            onCancel={() => router.push("/admin/produtos")}
            loading={updateMutation.isPending}
          />
        </div>
      </AdminLayout>
    </>
  );
}
