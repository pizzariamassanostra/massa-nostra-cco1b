// ============================================
// COMPONENTE: DATA TABLE
// ============================================
// Componente genérico de tabela com suporte a paginação,
// filtros, expansão de linhas e renderização flexível.
// Baseado no TanStack React Table.
// ============================================

import {
  ColumnDef,
  PaginationState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./pagination";
import { useMemo, useState } from "react";

// ============================================
// INTERFACES
// ============================================
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Definição das colunas da tabela
  data: TData[]; // Dados que serão renderizados na tabela
  itemsCount?: number; // Quantidade total de itens (para paginação manual)
  paginationEnabled?: boolean; // Define se a paginação será exibida
  pagination?: PaginationState; // Estado de paginação controlado externamente
  onPaginationChange?: (pagination: PaginationState) => void; // Callback ao alterar paginação
  tableOptions?: Partial<TableOptions<TData>>; // Opções adicionais do TanStack Table
}

// ============================================
// COMPONENTE
// ============================================
export function DataTable<TData, TValue>({
  columns,
  data,
  itemsCount = data.length,
  pagination,
  paginationEnabled,
  onPaginationChange,
  tableOptions,
}: Readonly<DataTableProps<TData, TValue>>) {
  // ============================================
  // DADOS PADRÃO
  // ============================================
  // Evita erros quando a tabela não possui registros
  const defaultData = useMemo(() => [], []);

  // ============================================
  // ESTADO DE PAGINAÇÃO INTERNA
  // ============================================
  // Utilizado quando a paginação não é controlada externamente
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    pagination ?? { pageIndex: 0, pageSize: 10 }
  );

  // ============================================
  // CONFIGURAÇÃO BASE DA TABELA
  // ============================================
  const defaultTableOptions: TableOptions<TData> = {
    data: data.length ? data : defaultData, // Usa dados reais ou fallback
    columns, // Definição das colunas
    getCoreRowModel: getCoreRowModel(), // Modelo base de linhas
    getExpandedRowModel: getExpandedRowModel(), // Suporte a linhas expansíveis
    getFilteredRowModel: getFilteredRowModel(), // Suporte a filtros
    getPaginationRowModel: getPaginationRowModel(), // Suporte a paginação

    // Calcula a quantidade total de páginas
    pageCount: Math.ceil(itemsCount / internalPagination.pageSize),

    ...tableOptions, // Permite sobrescrever opções padrão
  };

  // ============================================
  // PAGINAÇÃO CONTROLADA EXTERNAMENTE
  // ============================================
  if (pagination) {
    defaultTableOptions.state = {
      ...defaultTableOptions.state,
      pagination, // Usa paginação vinda do componente pai
    };

    defaultTableOptions.manualPagination = true; // Indica paginação manual

    // Atualiza paginação via callback externo
    defaultTableOptions.onPaginationChange = (updater) => {
      const newValue =
        typeof updater === "function" ? updater(pagination) : updater;

      onPaginationChange?.(newValue);
    };
  } else {
    // ============================================
    // PAGINAÇÃO INTERNA
    // ============================================
    defaultTableOptions.state = {
      ...defaultTableOptions.state,
      pagination: internalPagination, // Usa estado interno
    };

    defaultTableOptions.onPaginationChange = (updater) => {
      setInternalPagination((old) => {
        const newValue = typeof updater === "function" ? updater(old) : updater;

        onPaginationChange?.(newValue); // Notifica se necessário
        return newValue;
      });
    };
  }

  // ============================================
  // INSTÂNCIA DA TABELA
  // ============================================
  const table = useReactTable<TData>(defaultTableOptions);

  return (
    <div>
      {/* Container da tabela */}
      <div className="rounded-md border bg-white">
        <Table className="w-full">
          {/* Cabeçalho */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Corpo da tabela */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Caso não haja resultados
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {paginationEnabled && (
        <DataTablePagination itemsCount={itemsCount} table={table} />
      )}
    </div>
  );
}
