// ============================================
// SERVIÇO: ADMIN
// ============================================
// Responsável por operações administrativas
// Inclui CRUD de recursos e gerenciamento de pedidos/produtos
// ============================================

import api from "../api.service";

// ============================================================================
// CLASSE DE SERVIÇO
// Responsável por fazer todas as requisições relacionadas ao painel admin
// ============================================================================
class AdminService {
  // Atualiza status de um pedido
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    const response = await api.put(`/order/${orderId}/status`, { status });
    return response.data;
  }

  // Lista todos os clientes (admin)
  async listCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<any> {
    const response = await api.get("/common-user/list", { params });
    return response.data;
  }

  // Ativa/Inativa produto
  async toggleProductStatus(productId: number): Promise<any> {
    const response = await api.patch(`/product/${productId}/toggle-status`);
    return response.data;
  }

  // Deleta produto (soft delete)
  async deleteProduct(productId: number): Promise<any> {
    const response = await api.delete(`/product/${productId}`);
    return response.data;
  }
}

// ============================================
// EXPORTAR INSTÂNCIA ÚNICA
// ============================================
export const adminService = new AdminService();
