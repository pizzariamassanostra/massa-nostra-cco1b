// ============================================
// COMPONENTE: TABLE
// ============================================
// Componente reutilizável de tabela com suporte a rolagem
// Usa forwardRef para permitir referência externa
// Inclui boas práticas de acessibilidade
// ============================================

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// COMPONENTE: TABLE
// ============================================
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <section
    aria-label="Tabela rolavel" // Acessibilidade para leitores de tela
    className="relative w-full overflow-auto"
  >
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    >
      {/* Caption obrigatório para acessibilidade */}
      <caption className="sr-only">Tabela de dados rolável</caption>

      {/* Conteúdo da tabela */}
      {props.children}
    </table>
  </section>
));

Table.displayName = "Table";

// ============================================
// COMPONENTE: TABLE HEADER
// ============================================
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));

TableHeader.displayName = "TableHeader";

// ============================================
// COMPONENTE: TABLE BODY
// ============================================
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));

TableBody.displayName = "TableBody";

// ============================================
// COMPONENTE: TABLE FOOTER
// ============================================
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));

TableFooter.displayName = "TableFooter";

// ============================================
// COMPONENTE: TABLE ROW
// ============================================
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));

TableRow.displayName = "TableRow";

// ============================================
// COMPONENTE: TABLE HEAD
// ============================================
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));

TableHead.displayName = "TableHead";

// ============================================
// COMPONENTE: TABLE CELL
// ============================================
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));

TableCell.displayName = "TableCell";

// ============================================
// COMPONENTE: TABLE CAPTION
// ============================================
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";

// ============================================
// EXPORTAÇÃO
// ============================================
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
