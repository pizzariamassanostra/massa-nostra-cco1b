// ============================================
// COMPONENTE: CAROUSEL
// ============================================
// Componente de carrossel reutilizável baseado no Embla Carousel.
// Suporta orientação horizontal/vertical, navegação por teclado,
// botões de navegação customizados e exposição da API externa.
// ============================================

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ============================================
// TIPOS AUXILIARES
// ============================================
type CarouselApi = UseEmblaCarouselType[1]; // API exposta pelo Embla
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0]; // Opções do carrossel
type CarouselPlugin = UseCarouselParameters[1]; // Plugins do Embla

// ============================================
// PROPS DO CAROUSEL
// ============================================
type CarouselProps = {
  opts?: CarouselOptions; // Opções do Embla Carousel
  plugins?: CarouselPlugin; // Plugins adicionais
  orientation?: "horizontal" | "vertical"; // Direção do carrossel
  setApi?: (api: CarouselApi) => void; // Callback para expor a API
};

// ============================================
// CONTEXTO DO CAROUSEL
// ============================================
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]; // Ref do container
  api: ReturnType<typeof useEmblaCarousel>[1]; // API do Embla
  scrollPrev: () => void; // Navega para o slide anterior
  scrollNext: () => void; // Navega para o próximo slide
  canScrollPrev: boolean; // Indica se pode voltar
  canScrollNext: boolean; // Indica se pode avançar
} & CarouselProps;

// Criação do contexto do Carousel
const CarouselContext = React.createContext<CarouselContextProps | null>(null);

// ============================================
// HOOK: useCarousel
// ============================================
// Hook interno para acessar o contexto do Carousel.
// Garante que seja utilizado apenas dentro do provider.
// ============================================
function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

// ============================================
// COMPONENTE: CAROUSEL (ROOT)
// ============================================
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Define eixo do carrossel baseado na orientação
    const axis = orientation === "horizontal" ? "x" : "y";

    // Inicializa Embla Carousel
    const [carouselRef, api] = useEmblaCarousel({ ...opts, axis }, plugins);

    // Estados de controle de navegação
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    // ============================================
    // CALLBACK: onSelect
    // ============================================
    // Atualiza estado ao mudar slide
    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    // Navega para o slide anterior
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    // Navega para o próximo slide
    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    // ============================================
    // NAVEGAÇÃO POR TECLADO
    // ============================================
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    // Expõe a API do Embla para o componente pai
    React.useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    // Registra eventos do Embla
    React.useEffect(() => {
      if (!api) return;

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

// ============================================
// COMPONENTE: CAROUSEL CONTENT
// ============================================
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

// ============================================
// COMPONENTE: CAROUSEL ITEM
// ============================================
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

// ============================================
// COMPONENTE: CAROUSEL PREVIOUS
// ============================================
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

// ============================================
// COMPONENTE: CAROUSEL NEXT
// ============================================
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

// ============================================
// EXPORTAÇÕES
// ============================================
export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
