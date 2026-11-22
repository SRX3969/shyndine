export type UserRole = "admin" | "manager" | "kitchen" | "waiter";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  lastLogin?: number;
}
