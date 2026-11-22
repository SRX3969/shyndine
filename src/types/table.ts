export interface Table {
  _id: string;
  tableNumber: string; // e.g. "T-01"
  section: "Main Hall" | "Royal Courtyard" | "Veranda" | "Private Dining";
  capacity: number; // e.g. 4
  isActive: boolean;
  isOccupied: boolean;
  qrToken: string; // Secure unguessable token e.g. "tbl_8f7b2c9e4a"
  currentSessionId?: string;
  activeOrdersCount?: number;
}

export interface TableSession {
  _id: string;
  tableId: string;
  tableNumber: string;
  qrToken: string;
  status: "active" | "billed" | "closed";
  startTime: number;
  endTime?: number;
  orderIds: string[];
  totalBillPaise: number;
  notes?: string;
}
