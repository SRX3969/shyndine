import { CustomizationOption } from "./dish";

export type OrderStatus =
  | "new"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export interface OrderItemCustomization {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  pricePaise: number;
}

export interface OrderItemSnapshot {
  id: string;
  dishId: string;
  dishName: string;
  pricePaise: number; // Snapshot of unit price at purchase
  quantity: number;
  dietary: "veg" | "non-veg" | "vegan" | "egg";
  customizations: OrderItemCustomization[];
  specialInstructions?: string;
  itemTotalPaise: number; // (pricePaise + sum(customizations)) * quantity
}

export interface OrderEvent {
  id: string;
  status: OrderStatus;
  timestamp: number;
  note?: string;
  actorRole?: "customer" | "waiter" | "kitchen" | "admin";
}

export interface Order {
  _id: string;
  orderNumber: string; // e.g. "SHYN-2611-001"
  restaurantId: string;
  tableId: string;
  tableNumber: string;
  tableSessionId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  trackingToken: string; // Unguessable token for customer tracking
  status: OrderStatus;
  items: OrderItemSnapshot[];
  specialInstructions?: string;
  subtotalPaise: number;
  taxPaise: number;
  discountPaise: number;
  totalPaise: number;
  events: OrderEvent[];
  createdAt: number;
  updatedAt: number;
}
