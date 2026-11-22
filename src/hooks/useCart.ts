"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Dish, OrderItemCustomization, Table } from "@/types";
import { calculateOrderTotals } from "@/lib/currency";

export interface CartItem {
  id: string; // Unique id for cart entry (dishId + customizations serialized)
  dish: Dish;
  quantity: number;
  customizations: OrderItemCustomization[];
  specialInstructions?: string;
  unitPricePaise: number;
}

const CART_STORAGE_KEY = "shyn_cart_v1";
const TABLE_STORAGE_KEY = "shyn_active_table_v1";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [activeTable, setActiveTableState] = useState<Table | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));

      const storedTable = localStorage.getItem(TABLE_STORAGE_KEY);
      if (storedTable) setActiveTableState(JSON.parse(storedTable));
    } catch {
      // Fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  const saveItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Ignore
    }
  }, []);

  const setActiveTable = useCallback((table: Table | null) => {
    setActiveTableState(table);
    try {
      if (table) {
        localStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(table));
      } else {
        localStorage.removeItem(TABLE_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, []);

  const addItem = useCallback(
    (
      dish: Dish,
      quantity = 1,
      customizations: OrderItemCustomization[] = [],
      specialInstructions?: string
    ) => {
      const customKey = customizations
        .map((c) => c.optionId)
        .sort()
        .join("-");
      const cartItemId = `${dish._id}_${customKey}`;

      const customizationTotal = customizations.reduce(
        (sum, c) => sum + c.pricePaise,
        0
      );
      const unitPricePaise = dish.pricePaise + customizationTotal;

      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === cartItemId);
        let next: CartItem[];

        if (existingIndex >= 0) {
          next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + quantity,
            specialInstructions:
              specialInstructions || next[existingIndex].specialInstructions,
          };
        } else {
          next = [
            ...prev,
            {
              id: cartItemId,
              dish,
              quantity,
              customizations,
              specialInstructions,
              unitPricePaise,
            },
          ];
        }

        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setItems((prev) => {
      const next = prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== cartItemId);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const { subtotalPaise, taxPaise, totalPaise } = useMemo(() => {
    return calculateOrderTotals(
      items.map((i) => ({
        pricePaise: i.unitPricePaise,
        quantity: i.quantity,
      })),
      5 // 5% GST
    );
  }, [items]);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    totalCount,
    subtotalPaise,
    taxPaise,
    totalPaise,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    activeTable,
    setActiveTable,
    isLoaded,
  };
}
