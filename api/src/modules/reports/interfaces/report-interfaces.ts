// ============================================
// INTERFACES: RELATÓRIOS
// ============================================
// Tipos de dados para relatórios
// ============================================

// ============================================
// VENDAS POR PERÍODO
// ============================================
export interface SalesReport {
  sales: any;
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_orders: number;
    total_revenue: number;
    total_items_sold: number;
    average_ticket: number;
    cancelled_orders: number;
    cancelled_revenue: number;
  };
  by_payment_method: Array<{
    method: string;
    count: number;
    total: number;
    percentage: number;
  }>;
  by_status: Array<{
    status: string;
    count: number;
    total: number;
  }>;
  daily_breakdown: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

// ============================================
// PRODUTOS MAIS VENDIDOS
// ============================================
export interface TopProductsReport {
  period: {
    start_date: string;
    end_date: string;
  };
  products: Array<{
    product_id: number;
    product_name: string;
    category: string;
    quantity_sold: number;
    total_revenue: number;
    percentage_of_sales: number;
    average_price: number;
  }>;
}

// ============================================
// ESTATÍSTICAS GERAIS
// ============================================
export interface DashboardStats {
  today: {
    orders: number;
    revenue: number;
    average_ticket: number;
  };
  week: {
    orders: number;
    revenue: number;
    average_ticket: number;
    growth_percentage: number;
  };
  month: {
    orders: number;
    revenue: number;
    average_ticket: number;
    growth_percentage: number;
  };
  top_products: Array<{
    name: string;
    quantity: number;
  }>;
  recent_orders: Array<{
    id: number;
    customer_name: string;
    total: number;
    status: string;
    created_at: Date;
  }>;
}

// ============================================
// RELATÓRIO DE CLIENTES
// ============================================
export interface CustomerReport {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_customers: number;
    new_customers: number;
    active_customers: number;
    total_orders: number;
  };
  top_customers: Array<{
    customer_id: number;
    customer_name: string;
    total_orders: number;
    total_spent: number;
    average_ticket: number;
    last_order_date: Date;
  }>;
}

// ============================================
// HORÁRIOS DE PICO
// ============================================
export interface PeakHoursReport {
  by_hour: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
  by_day_of_week: Array<{
    day: string;
    orders: number;
    revenue: number;
  }>;
}
