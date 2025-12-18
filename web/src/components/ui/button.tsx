// ============================================
// COMPONENTE: BUTTON (Radix + Tailwind + CVA)
// ============================================
// Componente de botão reutilizável e altamente configurável.
// - Usa class-variance-authority (CVA) para variações de estilo
// - Suporta múltiplas variantes visuais e tamanhos
// - Integra Radix Slot para composição flexível
// - Utiliza utilitário `cn` para mesclar classes
// ============================================

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================
// VARIANTES DE ESTILO (CVA)
// ============================================
// Define variações visuais e tamanhos do botão
// ============================================
const buttonVariants = cva(
  // Classes base aplicadas a todos os botões
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Variações visuais
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },

      // Variações de tamanho
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },

    // Valores padrão
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ============================================
// INTERFACES
// ============================================
// Props do componente Button
// ============================================
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // Permite renderizar como Slot (Radix)
}

// ============================================
// COMPONENTE: BUTTON
// ============================================
// Componente principal do botão
// ============================================
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Define se o botão será renderizado como Slot ou <button>
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({
            variant, // Variante visual
            size, // Tamanho do botão
            className, // Classes adicionais
          })
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

// ============================================
// EXPORTAÇÕES
// ============================================
export { Button, buttonVariants };
