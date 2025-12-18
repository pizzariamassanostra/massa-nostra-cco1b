// ============================================
// HOOK: useDebounce
// ============================================

import { useEffect, useState } from "react";

// ============================================
// FUNÇÃO / HOOK: useDebounce
// ============================================
// Retorna um valor atualizado apenas após um intervalo de tempo (debounce)
// Útil para inputs de busca, filtros e chamadas de API
// ============================================
export default function useDebounce(value: string, delay: number) {
  // Estado que armazena o valor após o tempo de debounce
  const [debouncedValue, setDebouncedValue] = useState(value);

  // ============================================
  // EFEITO: Controle do tempo de debounce
  // ============================================
  useEffect(() => {
    // Cria um timer que atualiza o valor somente após o delay definido
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer caso value ou delay mudem antes do tempo expirar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // ============================================
  // RETORNO
  // ============================================
  // Retorna o valor final após o tempo de debounce
  return debouncedValue;
}
