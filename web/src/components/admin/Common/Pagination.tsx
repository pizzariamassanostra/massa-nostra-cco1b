// ============================================
// COMPONENT: PAGINAÇÃO
// ============================================

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================
// INTERFACE: Propriedades do componente
// ============================================
interface PaginationProps {
  currentPage: number; // Página atual
  totalPages: number; // Total de páginas disponíveis
  onPageChange: (page: number) => void; // Função chamada ao trocar de página
}

// ============================================
// COMPONENTE: Controle de paginação
// ============================================
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // ============================================
  // FUNÇÃO: Calcular páginas visíveis
  // ============================================
  const getPageNumbers = () => {
    const pages: (number | string)[] = []; // Lista final de páginas exibidas
    const maxVisible = 5; // Máximo de páginas visíveis no componente

    // Quando o total de páginas é pequeno, exibe todas
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i); // Adiciona todas as páginas
      }
    } else {
      // ============================================
      // CASO: Início da paginação
      // ============================================
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i); // Primeiras páginas
        pages.push("..."); // Reticências
        pages.push(totalPages); // Última página
      }
      // ============================================
      // CASO: Final da paginação
      // ============================================
      else if (currentPage >= totalPages - 2) {
        pages.push(1); // Primeira página
        pages.push("..."); // Reticências
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i); // Últimas páginas
      }
      // ============================================
      // CASO: Meio da paginação
      // ============================================
      else {
        pages.push(1); // Primeira página
        pages.push("..."); // Reticências
        pages.push(currentPage - 1); // Página anterior
        pages.push(currentPage); // Página atual
        pages.push(currentPage + 1); // Próxima página
        pages.push("..."); // Reticências
        pages.push(totalPages); // Última página
      }
    }

    return pages; // Retorna lista final de páginas
  };

  // ============================================
  // CONDIÇÃO: Não renderiza se houver apenas uma página
  // ============================================
  if (totalPages <= 1) return null;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* ============================================ */}
      {/* BOTÃO: Página anterior */}
      {/* ============================================ */}
      <button
        onClick={() => onPageChange(currentPage - 1)} // Volta uma página
        disabled={currentPage === 1} // Desabilita na primeira página
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* ============================================ */}
      {/* NÚMEROS DAS PÁGINAS */}
      {/* ============================================ */}
      {getPageNumbers().map((page, index) => {
        // Exibe reticências quando aplicável
        if (page === "... ") {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)} // Navega para a página clicada
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? "bg-red-600 text-white" // Página atual destacada
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page} {/* Número da página */}
          </button>
        );
      })}

      {/* ============================================ */}
      {/* BOTÃO: Próxima página */}
      {/* ============================================ */}
      <button
        onClick={() => onPageChange(currentPage + 1)} // Avança uma página
        disabled={currentPage === totalPages} // Desabilita na última página
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
