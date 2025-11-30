// ============================================
// COMPONENTE: DATA TABLE PAGINATION
// ============================================
// Componente de paginação para tabelas usando TanStack Table.
// Permite selecionar quantidade de itens por página e navegar
// entre páginas com botões de anterior/próximo.
// ============================================

import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Props do componente de paginação
interface DataTablePaginationProps<T> {
  table: Table<T>; // Instância da tabela
  itemsCount?: number; // Quantidade total de itens (opcional)
}

export const DataTablePagination = <T,>({
  table,
  itemsCount,
}: DataTablePaginationProps<T>) => {
  // Estado atual da paginação
  const { pageIndex, pageSize } = table.getState().pagination;

  // Garante que totalItems nunca seja undefined
  const totalItems = itemsCount ?? 0;

  // Verifica se está na última página
  const isLastPage = pageIndex === table.getPageCount() - 1;

  // Calcula índice final da página
  let endIndex = (pageIndex + 1) * pageSize;
  if (isLastPage) endIndex = totalItems;
  if (pageIndex === 0) endIndex = pageSize;

  // Calcula índice inicial da página
  const startIndex = pageIndex * pageSize + 1;

  return (
    <div className="flex justify-between mt-2 gap-3">
      {/* Seleção de quantidade por página */}
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Por página</p>

        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navegação entre páginas */}
      <div className="flex space-x-2 items-center">
        <p className="text-sm font-medium">
          {startIndex} - {endIndex} de {totalItems}
        </p>

        {/* Botão página anterior */}
        <button
          className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300"
          onClick={() => table.previousPage()}
        >
          <ArrowLeft />
        </button>

        {/* Botão próxima página */}
        <button
          className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300"
          onClick={() => table.nextPage()}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};
