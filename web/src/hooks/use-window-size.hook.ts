// ============================================
// HOOK: useWindowSize
// ============================================
// Hook personalizado para obter tamanho atual da janela.
// Retorna largura e altura em tempo real, atualizando ao redimensionar.
// ============================================

import { useEffect, useState } from "react";

// ============================================
// HOOK PRINCIPAL
// ============================================
export function useWindowSize() {
  // Estado com dimensões da janela
  const [windowSize, setWindowSize] = useState({
    width: 0, // Largura da janela
    height: 0, // Altura da janela
  });

  // ============================================
  // EFEITO: Monitorar resize da janela
  // ============================================
  useEffect(() => {
    // Atualiza estado com dimensões atuais
    function handleResize() {
      setWindowSize({
        width: window.innerWidth, // Captura largura atual
        height: window.innerHeight, // Captura altura atual
      });
    }

    // Registrar listener de resize
    window.addEventListener("resize", handleResize);

    // Executar imediatamente para valor inicial
    handleResize();

    // Cleanup: remover listener ao desmontar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Retornar dimensões atuais
  return windowSize;
}
