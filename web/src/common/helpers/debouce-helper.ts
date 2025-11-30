// ============================================
// HOOK: useDebounce
// ============================================
// Hook personalizado para aplicar debounce em valores.
// - Retorna o valor apenas após o tempo de `delay`.
// - Útil para evitar chamadas excessivas em buscas, inputs, etc.
// ============================================

import { useEffect, useState } from "react";

export default function useDebounce(value: string, delay: number) {
  // Estado que guarda o valor "debounced"
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Cria um timer que atualiza o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor ou delay mudar antes de completar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // Retorna o valor apenas após o tempo de debounce
  return debouncedValue;
}
