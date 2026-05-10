export type Role = "Admin" | "Staff";

export type SupportType = "Return" | "Non-Support";
export type SupportWeek = "1 week" | "2 weeks" | "3 weeks" | "1 month";

export type ProductLifecycle = "Active" | "Warning" | "Return Due" | "Expired" | "Closed";

export type AlertLevel = "Green" | "Yellow" | "Orange" | "Red" | "Critical";

export interface User {
  id: string;
  staffId: string;
  name: string;
  password?: string;
  role: Role;
  assignedCategory?: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  expireDate: string;
  quantity: number;
  supportType: SupportType;
  supportWeek?: SupportWeek;
  assignedStaffId: string;
  assignedStaffName: string;
  category: string;
  lifecycle: ProductLifecycle;
  alertLevel: AlertLevel;
  daysLeft: number;
}

export interface AuditLog {
  id: string;
  action: string;
  productId?: string;
  productName?: string;
  details?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export type ProductStatus =
  | "safe"
  | "return-soon"
  | "return-urgent"
  | "expired"
  | "non-support-safe"
  | "non-support-expiring"
  | "non-support-critical";
