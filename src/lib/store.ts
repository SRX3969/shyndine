"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dish,
  Category,
  Table,
  Order,
  OrderStatus,
  Invoice,
  Restaurant,
  OrderItemSnapshot,
} from "@/types";
import {
  initialCategories,
  initialDishes,
  initialRestaurant,
  initialTables,
} from "./seedData";
import { calculateOrderTotals } from "./currency";

// In-memory singletons initialized with localStorage backup if in browser
const STORAGE_KEY_PREFIX = "shyn_restaurant_";

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to persist to localStorage", e);
  }
}

// Global subscribers for real-time reactivity without page refresh
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
  // Cross-tab synchronization
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel("shyn_sync_channel");
      channel.postMessage({ type: "SYNC", timestamp: Date.now() });
      channel.close();
    } catch {
      // Ignore broadcast errors
    }
  }
}

// Initial orders seed to demonstrate live Kanban and Kitchen on first load
const initialOrdersSeed: Order[] = [
  {
    _id: "ord_001",
    orderNumber: "SHYN-101",
    restaurantId: "rest_01",
    tableId: "tbl_02",
    tableNumber: "T-02",
    tableSessionId: "sess_02",
    customerName: "Vikram Malhotra",
    customerPhone: "+91 98112 34567",
    customerEmail: "vikram@example.com",
    trackingToken: "trk_alpha_01",
    status: "preparing",
    specialInstructions: "Less spicy in Galouti, extra mint chutney please.",
    items: [
      {
        id: "item_01",
        dishId: "dish_01",
        dishName: "Shahi Awadhi Galouti Kebab",
        pricePaise: 85000,
        quantity: 1,
        dietary: "non-veg",
        customizations: [
          {
            groupId: "cust_sheermal",
            groupTitle: "Accompaniment Choice",
            optionId: "opt_sheermal_mini",
            optionName: "2 Mini Saffron Sheermal",
            pricePaise: 0,
          },
        ],
        itemTotalPaise: 85000,
      },
      {
        id: "item_02",
        dishId: "dish_09",
        dishName: "Smoked Rose & Cardamom Lassi",
        pricePaise: 29000,
        quantity: 2,
        dietary: "veg",
        customizations: [],
        itemTotalPaise: 58000,
      },
    ],
    subtotalPaise: 143000,
    taxPaise: 7150,
    discountPaise: 0,
    totalPaise: 150150,
    events: [
      {
        id: "evt_1",
        status: "new",
        timestamp: Date.now() - 15 * 60 * 1000,
        actorRole: "customer",
      },
      {
        id: "evt_2",
        status: "accepted",
        timestamp: Date.now() - 12 * 60 * 1000,
        actorRole: "waiter",
      },
      {
        id: "evt_3",
        status: "preparing",
        timestamp: Date.now() - 8 * 60 * 1000,
        note: "Chef started tandoor preparation",
        actorRole: "kitchen",
      },
    ],
    createdAt: Date.now() - 15 * 60 * 1000,
    updatedAt: Date.now() - 8 * 60 * 1000,
  },
  {
    _id: "ord_002",
    orderNumber: "SHYN-102",
    restaurantId: "rest_01",
    tableId: "tbl_04",
    tableNumber: "T-04",
    tableSessionId: "sess_04",
    customerName: "Ananya Sharma",
    customerPhone: "+91 99201 88210",
    trackingToken: "trk_beta_02",
    status: "new",
    items: [
      {
        id: "item_03",
        dishId: "dish_02",
        dishName: "Dal SHYN Bukhara (18-Hour Simmer)",
        pricePaise: 62000,
        quantity: 1,
        dietary: "veg",
        customizations: [],
        itemTotalPaise: 62000,
      },
      {
        id: "item_04",
        dishId: "dish_06",
        dishName: "Truffle & Garlic Butter Naan",
        pricePaise: 24000,
        quantity: 3,
        dietary: "veg",
        customizations: [],
        itemTotalPaise: 72000,
      },
      {
        id: "item_05",
        dishId: "dish_08",
        dishName: "Zafrani Phirni in Clay Kasora",
        pricePaise: 38000,
        quantity: 2,
        dietary: "veg",
        customizations: [],
        itemTotalPaise: 76000,
      },
    ],
    subtotalPaise: 210000,
    taxPaise: 10500,
    discountPaise: 0,
    totalPaise: 220500,
    events: [
      {
        id: "evt_4",
        status: "new",
        timestamp: Date.now() - 2 * 60 * 1000,
        actorRole: "customer",
      },
    ],
    createdAt: Date.now() - 2 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 1000,
  },
];

// Master state container
class RestaurantStore {
  restaurant: Restaurant = initialRestaurant;
  categories: Category[] = initialCategories;
  dishes: Dish[] = initialDishes;
  tables: Table[] = initialTables;
  orders: Order[] = initialOrdersSeed;
  invoices: Invoice[] = [];
  initialized = false;

  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.restaurant = getStorageItem("restaurant", initialRestaurant);
    this.categories = getStorageItem("categories", initialCategories);
    this.dishes = getStorageItem("dishes", initialDishes);
    this.tables = getStorageItem("tables", initialTables);
    this.orders = getStorageItem("orders", initialOrdersSeed);
    this.invoices = getStorageItem("invoices", []);
    this.initialized = true;

    // Listen for broadcast channel updates
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("shyn_sync_channel");
      channel.onmessage = () => {
        this.orders = getStorageItem("orders", this.orders);
        this.dishes = getStorageItem("dishes", this.dishes);
        this.tables = getStorageItem("tables", this.tables);
        this.invoices = getStorageItem("invoices", this.invoices);
        listeners.forEach((l) => l());
      };
    }
  }

  save() {
    setStorageItem("restaurant", this.restaurant);
    setStorageItem("categories", this.categories);
    setStorageItem("dishes", this.dishes);
    setStorageItem("tables", this.tables);
    setStorageItem("orders", this.orders);
    setStorageItem("invoices", this.invoices);
    notifyListeners();
  }

  // --- Dish Actions ---
  getDishes(): Dish[] {
    return this.dishes;
  }

  getDishBySlug(slug: string): Dish | undefined {
    return this.dishes.find((d) => d.slug === slug);
  }

  getDishById(id: string): Dish | undefined {
    return this.dishes.find((d) => d._id === id);
  }

  saveDish(dishData: Partial<Dish> & { name: string; pricePaise: number }): Dish {
    const existingIndex = this.dishes.findIndex((d) => d._id === dishData._id);
    let updated: Dish;

    if (existingIndex >= 0) {
      updated = {
        ...this.dishes[existingIndex],
        ...dishData,
        updatedAt: Date.now(),
      } as Dish;
      this.dishes[existingIndex] = updated;
    } else {
      const newId = `dish_${Date.now()}`;
      updated = {
        _id: newId,
        slug:
          dishData.slug ||
          dishData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        categoryId: dishData.categoryId || "cat_starters",
        description: dishData.description || "",
        pricePaise: dishData.pricePaise,
        dietary: dishData.dietary || "veg",
        spiceLevel: dishData.spiceLevel || 1,
        portionSize: dishData.portionSize || "Serves 1-2",
        preparationTimeMinutes: dishData.preparationTimeMinutes || 15,
        ingredients: dishData.ingredients || [],
        allergens: dishData.allergens || [],
        images: dishData.images || [
          {
            id: `img_${Date.now()}`,
            url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85",
            caption: dishData.name,
            isPrimary: true,
          },
        ],
        isAvailable: dishData.isAvailable ?? true,
        isFeatured: dishData.isFeatured ?? false,
        isChefSpecial: dishData.isChefSpecial ?? false,
        displayOrder: this.dishes.length + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Dish;
      this.dishes.push(updated);
    }

    this.save();
    return updated;
  }

  toggleDishAvailability(id: string): boolean {
    const dish = this.dishes.find((d) => d._id === id);
    if (!dish) return false;
    dish.isAvailable = !dish.isAvailable;
    dish.updatedAt = Date.now();
    this.save();
    return dish.isAvailable;
  }

  deleteDish(id: string): void {
    this.dishes = this.dishes.filter((d) => d._id !== id);
    this.save();
  }

  // --- Category Actions ---
  getCategories(): Category[] {
    return this.categories;
  }

  saveCategory(catData: Partial<Category> & { name: string }): Category {
    const existingIndex = this.categories.findIndex((c) => c._id === catData._id);
    let updated: Category;

    if (existingIndex >= 0) {
      updated = { ...this.categories[existingIndex], ...catData };
      this.categories[existingIndex] = updated;
    } else {
      updated = {
        _id: `cat_${Date.now()}`,
        name: catData.name,
        slug:
          catData.slug ||
          catData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: catData.description || "",
        imageUrl: catData.imageUrl,
        displayOrder: this.categories.length + 1,
        isActive: true,
      };
      this.categories.push(updated);
    }

    this.save();
    return updated;
  }

  deleteCategory(id: string): void {
    this.categories = this.categories.filter((c) => c._id !== id);
    this.save();
  }

  // --- Table Actions ---
  getTables(): Table[] {
    return this.tables;
  }

  getTableByToken(qrToken: string): Table | undefined {
    return this.tables.find((t) => t.qrToken === qrToken);
  }

  getTableById(id: string): Table | undefined {
    return this.tables.find((t) => t._id === id);
  }

  saveTable(tableData: Partial<Table> & { tableNumber: string }): Table {
    const existingIndex = this.tables.findIndex((t) => t._id === tableData._id);
    let updated: Table;

    if (existingIndex >= 0) {
      updated = { ...this.tables[existingIndex], ...tableData };
      this.tables[existingIndex] = updated;
    } else {
      updated = {
        _id: `tbl_${Date.now()}`,
        tableNumber: tableData.tableNumber,
        section: tableData.section || "Main Hall",
        capacity: tableData.capacity || 4,
        isActive: true,
        isOccupied: false,
        qrToken: `tbl_royal_${tableData.tableNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Math.random().toString(36).substring(2, 6)}`,
      };
      this.tables.push(updated);
    }

    this.save();
    return updated;
  }

  // --- Order Actions ---
  getOrders(): Order[] {
    return this.orders.slice().sort((a, b) => b.createdAt - a.createdAt);
  }

  getOrderByTrackingToken(token: string): Order | undefined {
    return this.orders.find((o) => o.trackingToken === token);
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o._id === id);
  }

  createOrder(payload: {
    table: Table;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    specialInstructions?: string;
    items: OrderItemSnapshot[];
  }): Order {
    const orderIndex = this.orders.length + 101;
    const orderNumber = `SHYN-${orderIndex}`;
    const trackingToken = `trk_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;

    const { subtotalPaise, taxPaise, totalPaise } = calculateOrderTotals(
      payload.items.map((i) => ({
        pricePaise: i.pricePaise,
        quantity: i.quantity,
        customizationPricePaise: i.customizations.reduce(
          (sum, c) => sum + c.pricePaise,
          0
        ),
      })),
      this.restaurant.taxRatePercent
    );

    const newOrder: Order = {
      _id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      restaurantId: "rest_01",
      tableId: payload.table._id,
      tableNumber: payload.table.tableNumber,
      tableSessionId:
        payload.table.currentSessionId || `sess_${payload.table.tableNumber}_${Date.now()}`,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      trackingToken,
      status: "new",
      specialInstructions: payload.specialInstructions,
      items: payload.items,
      subtotalPaise,
      taxPaise,
      discountPaise: 0,
      totalPaise,
      events: [
        {
          id: `evt_${Date.now()}`,
          status: "new",
          timestamp: Date.now(),
          actorRole: "customer",
          note: "Order placed from table QR",
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.orders.unshift(newOrder);

    // Mark table as occupied
    const tableIndex = this.tables.findIndex((t) => t._id === payload.table._id);
    if (tableIndex >= 0) {
      this.tables[tableIndex].isOccupied = true;
      this.tables[tableIndex].currentSessionId = newOrder.tableSessionId;
    }

    this.save();
    return newOrder;
  }

  updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    actorRole: "admin" | "waiter" | "kitchen" = "admin"
  ): Order | undefined {
    const order = this.orders.find((o) => o._id === orderId);
    if (!order) return undefined;

    order.status = newStatus;
    order.updatedAt = Date.now();
    order.events.push({
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      status: newStatus,
      timestamp: Date.now(),
      note,
      actorRole,
    });

    this.save();
    return order;
  }

  // --- Invoicing & Billing ---
  generateInvoice(orderId: string): Invoice {
    const order = this.orders.find((o) => o._id === orderId);
    if (!order) throw new Error("Order not found");

    const existing = this.invoices.find((i) => i.orderId === orderId);
    if (existing) return existing;

    const invoiceNum = `INV-2026-${String(this.invoices.length + 42).padStart(4, "0")}`;

    const newInvoice: Invoice = {
      _id: `inv_${Date.now()}`,
      invoiceNumber: invoiceNum,
      orderId: order._id,
      tableSessionId: order.tableSessionId,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      items: order.items,
      subtotalPaise: order.subtotalPaise,
      taxPaise: order.taxPaise,
      taxRatePercent: this.restaurant.taxRatePercent,
      serviceChargePaise: 0,
      discountPaise: order.discountPaise,
      grandTotalPaise: order.totalPaise,
      issuedAt: Date.now(),
      status: "issued",
      paymentSettlementNote: "Manual payment at restaurant counter / table (Cash/UPI/Card POS)",
    };

    this.invoices.unshift(newInvoice);
    this.save();
    return newInvoice;
  }

  getInvoices(): Invoice[] {
    return this.invoices;
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.invoices.find((i) => i._id === id || i.invoiceNumber === id);
  }

  settleInvoice(invoiceId: string, note?: string): Invoice | undefined {
    const inv = this.invoices.find((i) => i._id === invoiceId);
    if (!inv) return undefined;
    inv.status = "settled";
    if (note) inv.paymentSettlementNote = note;
    this.save();
    return inv;
  }

  // Clear table session
  closeTableSession(tableId: string): void {
    const table = this.tables.find((t) => t._id === tableId);
    if (table) {
      table.isOccupied = false;
      table.currentSessionId = undefined;
      this.save();
    }
  }
}

export const store = new RestaurantStore();

// React hook for subscribing to store updates
export function useRestaurantStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    store.init();
    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return store;
}
