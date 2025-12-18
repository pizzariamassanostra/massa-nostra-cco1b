// ============================================
// COMPONENT: DATA TABLE
// ============================================

// ============================================
// IMPORTS
// ============================================
import React from "react";
import { ArrowUpDown } from "lucide-react";

// ============================================
// INTERFACE: Column (Configuração de cada coluna da tabela)
// ============================================
export interface Column<T> {
  key: keyof T | string; // Chave usada para acessar o valor no item
  label: string; // Nome exibido no cabeçalho da coluna
  sortable?: boolean; // Indica se a coluna suporta ordenação
  render?: (item: T) => React.ReactNode; // Renderização personalizada opcional
}

// ============================================
// INTERFACE: DataTableProps (Propriedades do componente)
// ============================================
interface DataTableProps<T> {
  data: T[]; // Lista de registros exibidos na tabela
  columns: Column<T>[]; // Configuração das colunas
  onSort?: (key: string) => void; // Callback de ordenação
  sortKey?: string; // Chave atualmente ordenada
  sortOrder?: "asc" | "desc"; // Direção da ordenação
  emptyMessage?: string; // Mensagem quando não há dados
}

// ============================================
// COMPONENT: DataTable
// Tabela genérica com suporte a ordenação
// ============================================
export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onSort,
  sortKey,
  sortOrder,
  emptyMessage = "Nenhum registro encontrado",
}: DataTableProps<T>) {
  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        {/* ============================================ */}
        {/* SEÇÃO: Cabeçalho da tabela */}
        {/* ============================================ */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>

                  {/* Botão de ordenação */}
                  {column.sortable && onSort && (
                    <button
                      onClick={() => onSort(column.key as string)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ============================================ */}
        {/* SEÇÃO: Corpo da tabela */}
        {/* ============================================ */}
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            // Linha exibida quando não há registros
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            // Renderização das linhas de dados
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.key as string}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {/* Render customizado ou valor direto */}
                    {column.render
                      ? column.render(item)
                      : (item[column.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
