"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { type Product } from "@/lib/type";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = useCallback(
    (product: Product, quantity: number) => {
      const existingItem = cartItems.find(
        (item) => item.product.id === product.id
      );

      const newQuantity = (existingItem?.quantity || 0) + quantity;

      if (newQuantity > product.stock) {
        toast.error("Stock insuffisant", {
          description: `Seulement ${product.stock} unités de ${product.name} sont disponibles.`,
        });
        return;
      }

      if (existingItem) {
        setCartItems(
          cartItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        setCartItems([...cartItems, { product, quantity }]);
      }

      toast.success("Produit ajouté", {
        description: `${quantity}x ${product.name} ajouté au panier.`,
      });
    },
    [cartItems]
  );

  const removeItem = useCallback(
    (productId: string) => {
      const item = cartItems.find((item) => item.product.id === productId);
      setCartItems(cartItems.filter((item) => item.product.id !== productId));

      toast.success("Produit retiré", {
        description: `${item?.product.name || "Produit"} retiré du panier.`,
      });
    },
    [cartItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const item = cartItems.find((item) => item.product.id === productId);
      if (!item) return;

      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      if (quantity > item.product.stock) {
        toast.error("Stock insuffisant", {
          description: `Seulement ${item.product.stock} unités de ${item.product.name} sont disponibles.`,
        });

        setCartItems(
          cartItems.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.product.stock }
              : item
          )
        );
        return;
      }

      setCartItems(
        cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    },
    [cartItems, removeItem]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.warning("Panier vidé", {
      description: "Votre panier a été vidé.",
    });
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + item.product.priceInCents * item.quantity;
    }, 0);
  }, [cartItems]);

  const value = React.useMemo(
    () => ({
      cartItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
    }),
    [cartItems, addItem, removeItem, updateQuantity, clearCart, getCartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
