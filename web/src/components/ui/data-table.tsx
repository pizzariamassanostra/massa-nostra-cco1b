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

// Props do componente DataTable
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Definição das colunas
  data: TData[]; // Dados da tabela
  itemsCount?: number; // Total de itens (opcional)
  paginationEnabled?: boolean; // Habilita paginação
  pagination?: PaginationState; // Estado de paginação externo
  onPaginationChange?: (pagination: PaginationState) => void; // Callback de mudança de paginação
  tableOptions?: Partial<TableOptions<TData>>; // Opções adicionais da tabela
}

export function DataTable<TData, TValue>({
  columns,
  data,
  itemsCount = data.length,
  pagination,
  paginationEnabled,
  onPaginationChange,
  tableOptions,
}: Readonly<DataTableProps<TData, TValue>>) {
  // Dados padrão caso não haja registros
  const defaultData = useMemo(() => [], []);

  // Estado interno de paginação (quando não controlado externamente)
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    pagination ?? { pageIndex: 0, pageSize: 10 }
  );

  // Configuração padrão da tabela
  const defaultTableOptions: TableOptions<TData> = {
    data: data.length ? data : defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // Calcula número de páginas
    pageCount: Math.ceil(itemsCount / internalPagination.pageSize),

    ...tableOptions,
  };

  // Caso a paginação seja controlada externamente
  if (pagination) {
    defaultTableOptions.state = {
      ...defaultTableOptions.state,
      pagination,
    };

    defaultTableOptions.manualPagination = true;

    // Corrigido: agora é uma função e não um objeto
    defaultTableOptions.onPaginationChange = (updater) => {
      const newValue =
        typeof updater === "function" ? updater(pagination) : updater;

      onPaginationChange?.(newValue);
    };
  } else {
    // Caso a paginação seja interna
    defaultTableOptions.state = {
      ...defaultTableOptions.state,
      pagination: internalPagination,
    };

    defaultTableOptions.onPaginationChange = (updater) => {
      setInternalPagination((old) => {
        const newValue = typeof updater === "function" ? updater(old) : updater;
        onPaginationChange?.(newValue);
        return newValue;
      });
    };
  }

  // Cria instância da tabela
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
