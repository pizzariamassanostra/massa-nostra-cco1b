// ============================================
// PÁGINA: CRIAR PRODUTO (ADMIN)
// ============================================
// Formulário de criação de produto
// Upload de imagem
// ============================================

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "@/components/admin/Layout/AdminLayout";
import ProductForm, {
  ProductFormData,
} from "@/components/admin/Products/ProductForm";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/services/api.service";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

// ============================================
// COMPONENTE
// ============================================
export default function NovoProdutoPage() {
  const router = useRouter();

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
  // MUTATION — CRIAR PRODUTO
  // ============================================
  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category_id", String(data.category_id));
      formData.append("base_price", String(data.base_price * 100)); // Converter para centavos
      formData.append("is_active", String(data.is_active));

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await api.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      router.push("/admin/produtos");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erro ao criar produto");
    },
  });

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
        <title>Novo Produto - Admin - Pizzaria Massa Nostra</title>
      </Head>

      <AdminLayout title="Novo Produto">
        {/* ============================================ */}
        {/* LINK — VOLTAR */}
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
            categories={categories}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => router.push("/admin/produtos")}
            loading={createMutation.isPending}
          />
        </div>
      </AdminLayout>
    </>
  );
}
