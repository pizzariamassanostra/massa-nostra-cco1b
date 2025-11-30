// ============================================
// COMPONENTE: SEPARATOR
// ============================================
// Componente reutilizável de separador visual.
// Baseado no Radix UI Separator, com suporte a orientação
// horizontal ou vertical e opção decorativa.
// Usa utilitário `cn` para mesclar classes.
// ============================================

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative} // Define se é apenas decorativo (não semântico)
      orientation={orientation} // Orientação: horizontal ou vertical
      className={cn(
        "shrink-0 bg-border", // Classe base
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", // Ajusta dimensões conforme orientação
        className // Permite sobrescrever/mesclar classes externas
      )}
      {...props}
    />
  )
);

// Define displayName para melhor debug e integração com React DevTools
Separator.displayName = SeparatorPrimitive.Root.displayName;

// Exporta componente para uso em toda aplicação
export { Separator };
