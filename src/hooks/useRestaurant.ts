"use client";

import { useRestaurantStore } from "@/lib/store";

export function useRestaurant() {
  const store = useRestaurantStore();

  return {
    restaurant: store.restaurant,
    categories: store.getCategories(),
    dishes: store.getDishes(),
    tables: store.getTables(),
    orders: store.getOrders(),
    invoices: store.getInvoices(),
    getDishBySlug: (slug: string) => store.getDishBySlug(slug),
    getDishById: (id: string) => store.getDishById(id),
    getTableByToken: (token: string) => store.getTableByToken(token),
    getTableById: (id: string) => store.getTableById(id),
    getOrderByTrackingToken: (token: string) =>
      store.getOrderByTrackingToken(token),
    getOrderById: (id: string) => store.getOrderById(id),
    getInvoiceById: (id: string) => store.getInvoiceById(id),
    createOrder: store.createOrder.bind(store),
    updateOrderStatus: store.updateOrderStatus.bind(store),
    saveDish: store.saveDish.bind(store),
    toggleDishAvailability: store.toggleDishAvailability.bind(store),
    deleteDish: store.deleteDish.bind(store),
    saveCategory: store.saveCategory.bind(store),
    deleteCategory: store.deleteCategory.bind(store),
    saveTable: store.saveTable.bind(store),
    generateInvoice: store.generateInvoice.bind(store),
    settleInvoice: store.settleInvoice.bind(store),
    closeTableSession: store.closeTableSession.bind(store),
  };
}
