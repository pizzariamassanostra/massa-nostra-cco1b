// ============================================
// CONTEXT: CARRINHO
// ============================================
// Gerencia estado global do carrinho de compras
// Persiste no localStorage
// ============================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";

// ============================================
// INTERFACES
// ============================================

export interface CartItem {
  id: string; // ID único gerado
  product_id: number;
  product_name: string;
  product_image: string | null;
  variant_id: number;
  variant_label: string;
  variant_price: number;
  crust_id: number | null;
  crust_name: string | null;
  crust_price: number;
  filling_id: number | null;
  filling_name: string | null;
  filling_price: number;
  quantity: number;
  unit_price: number; // Preço unitário
  total_price: number;
}

interface CartContextData {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// ============================================
// CRIAR CONTEXTO
// ============================================

const CartContext = createContext<CartContextData>({} as CartContextData);

// ============================================
// PROVIDER
// ============================================

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const deliveryFee = 5;

  // ============================================
  // CARREGAR DO LOCALSTORAGE
  // ============================================
  useEffect(() => {
    if (!globalThis.window) return;

    const storedCart = localStorage.getItem("cart");
    if (!storedCart) return;

    try {
      setItems(JSON.parse(storedCart));
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      localStorage.removeItem("cart");
    }
  }, []);

  // ============================================
  // SALVAR NO LOCALSTORAGE
  // ============================================
  useEffect(() => {
    if (globalThis.window) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  // ============================================
  // ADICIONAR ITEM
  // ============================================
  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;

        toast.success("Quantidade atualizada!");

        return prevItems.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: newQuantity,
                total_price: i.unit_price * newQuantity,
              }
            : i
        );
      }

      toast.success(`${item.product_name} adicionado ao carrinho!`);

      return [
        ...prevItems,
        {
          ...item,
          total_price: item.unit_price * item.quantity,
        },
      ];
    });

    setIsOpen(true);
  }, []);

  // ============================================
  // REMOVER ITEM
  // ============================================
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removido do carrinho");
  }, []);

  // ============================================
  // ATUALIZAR QUANTIDADE
  // ============================================
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removido do carrinho");
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              total_price: item.unit_price * quantity,
            }
          : item
      )
    );
  }, []);

  // ============================================
  // LIMPAR CARRINHO
  // ============================================
  const clearCart = useCallback(() => {
    setItems([]);
    if (globalThis.window) localStorage.removeItem("cart");
    toast.success("Carrinho limpo");
  }, []);

  // ============================================
  // ABRIR/FECHAR
  // ============================================
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // ============================================
  // CÁLCULOS
  // ============================================
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
  const total = subtotal + deliveryFee;

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      deliveryFee,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      totalItems,
      subtotal,
      deliveryFee,
      total,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ============================================
// HOOK PERSONALIZADO
// ============================================
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
};
