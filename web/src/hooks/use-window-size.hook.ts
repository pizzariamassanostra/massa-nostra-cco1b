// ============================================
// HOOK: useWindowSize
// ============================================
// Hook personalizado para obter tamanho atual da janela.
// Retorna largura e altura em tempo real, atualizando ao redimensionar.
// ============================================

import { useEffect, useState } from "react";

export function useWindowSize() {
  // Estado inicial com largura e altura = 0
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Função que atualiza estado com dimensões da janela
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Adiciona listener para evento de resize
    window.addEventListener("resize", handleResize);

    // Executa uma vez ao montar para capturar tamanho inicial
    handleResize();

    // Remove listener ao desmontar componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Retorna objeto com largura e altura atuais
  return windowSize;
}
