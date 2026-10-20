"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string | null;
  description?: string | null;
  stock: number;
  unit?: string | null;
};

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  /* =========================================
     LOAD CART FROM LOCAL STORAGE
  ========================================= */

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(
        "zion-agro-cart"
      );

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error(
        "Unable to load cart:",
        error
      );
    }
  }, []);

  /* =========================================
     SAVE CART TO LOCAL STORAGE
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "zion-agro-cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Unable to save cart:",
        error
      );
    }
  }, [cart]);

  /* =========================================
     ADD TO CART
  ========================================= */

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) => item.id === product.id
        );

      if (existingProduct) {
        const newQuantity =
          existingProduct.quantity + 1;

        // Don't allow quantity to exceed stock.
        if (
          newQuantity >
          Number(existingProduct.stock)
        ) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        );
      }

      if (Number(product.stock) <= 0) {
        return currentCart;
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  /* =========================================
     REMOVE FROM CART
  ========================================= */

  const removeFromCart = (id: string) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };

  /* =========================================
     INCREASE QUANTITY
  ========================================= */

  const increaseQuantity = (id: string) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (
          item.quantity >=
          Number(item.stock)
        ) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  /* =========================================
     DECREASE QUANTITY
  ========================================= */

  const decreaseQuantity = (id: string) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  /* =========================================
     UPDATE QUANTITY
  ========================================= */

  const updateQuantity = (
    id: string,
    quantity: number
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const safeQuantity = Math.min(
            Math.max(quantity, 1),
            Number(item.stock)
          );

          return {
            ...item,
            quantity: safeQuantity,
          };
        })
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  /* =========================================
     CLEAR CART
  ========================================= */

  const clearCart = () => {
    setCart([]);
  };

  /* =========================================
     CART COUNT
  ========================================= */

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );

  /* =========================================
     SUBTOTAL
  ========================================= */

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}