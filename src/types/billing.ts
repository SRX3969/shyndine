import { OrderItemSnapshot } from "./order";

export interface Invoice {
  _id: string;
  invoiceNumber: string; // e.g. "INV-2026-0042"
  orderId?: string;
  tableSessionId?: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItemSnapshot[];
  subtotalPaise: number;
  taxPaise: number;
  taxRatePercent: number;
  serviceChargePaise: number;
  discountPaise: number;
  grandTotalPaise: number;
  issuedAt: number;
  paymentSettlementNote?: string; // e.g. "Settled via Cash / POS Terminal at counter"
  status: "draft" | "issued" | "settled";
}

export interface KitchenOrderTicket {
  id: string;
  kotNumber: string; // e.g. "KOT-084"
  orderNumber: string;
  tableNumber: string;
  createdAt: number;
  items: {
    name: string;
    quantity: number;
    dietary: string;
    customizations: string[];
    specialInstructions?: string;
  }[];
  notes?: string;
}
