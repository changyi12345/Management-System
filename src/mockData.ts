import type { User, Product, AuditLog } from "./types";

const today = new Date();

function calculateProductFields(expireDateStr: string): { lifecycle: Product["lifecycle"], alertLevel: Product["alertLevel"], daysLeft: number } {
  const expire = new Date(expireDateStr);
  const diffTime = expire.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let lifecycle: Product["lifecycle"] = "Active";
  let alertLevel: Product["alertLevel"] = "Green";

  if (diffDays < 0) {
    lifecycle = "Expired";
    alertLevel = "Critical";
  } else if (diffDays <= 1) {
    lifecycle = "Return Due";
    alertLevel = "Red";
  } else if (diffDays <= 7) {
    lifecycle = "Return Due";
    alertLevel = "Orange";
  } else if (diffDays <= 14) {
    lifecycle = "Warning";
    alertLevel = "Yellow";
  } else if (diffDays <= 30) {
    lifecycle = "Warning";
    alertLevel = "Green";
  }

  return { lifecycle, alertLevel, daysLeft: diffDays };
}

export const mockUsers: User[] = [
  {
    id: "1",
    staffId: "ADMIN001",
    name: "Admin",
    password: "admin123",
    role: "Admin"
  },
  {
    id: "2",
    staffId: "SFF001",
    name: "Mg Mg",
    password: "mgmg123",
    role: "Staff",
    assignedCategory: "Drinks"
  },
  {
    id: "3",
    staffId: "SFF002",
    name: "Su Su",
    password: "susu123",
    role: "Staff",
    assignedCategory: "Snacks"
  },
  {
    id: "4",
    staffId: "SFF003",
    name: "Kyaw Kyaw",
    password: "kyawkyaw123",
    role: "Staff",
    assignedCategory: "Frozen Food"
  }
];

export const initialProducts: Omit<Product, "lifecycle" | "alertLevel" | "daysLeft">[] = [
  {
    id: "1",
    name: "Milk 1L",
    barcode: "123456789012",
    expireDate: "2026-05-14",
    quantity: 25,
    supportType: "Return",
    assignedStaffId: "2",
    assignedStaffName: "Mg Mg",
    category: "Drinks"
  },
  {
    id: "2",
    name: "Cola 500ml",
    barcode: "987654321098",
    expireDate: "2026-05-20",
    quantity: 50,
    supportType: "Return",
    assignedStaffId: "2",
    assignedStaffName: "Mg Mg",
    category: "Drinks"
  },
  {
    id: "3",
    name: "Orange Juice",
    barcode: "456789012345",
    expireDate: "2026-05-10",
    quantity: 15,
    supportType: "Return",
    assignedStaffId: "2",
    assignedStaffName: "Mg Mg",
    category: "Drinks"
  },
  {
    id: "4",
    name: "Potato Chips",
    barcode: "321098765432",
    expireDate: "2026-06-01",
    quantity: 30,
    supportType: "Non-Support",
    assignedStaffId: "3",
    assignedStaffName: "Su Su",
    category: "Snacks"
  },
  {
    id: "5",
    name: "Chocolate Bar",
    barcode: "654321098765",
    expireDate: "2026-05-15",
    quantity: 20,
    supportType: "Non-Support",
    assignedStaffId: "3",
    assignedStaffName: "Su Su",
    category: "Snacks"
  },
  {
    id: "6",
    name: "Frozen Chicken",
    barcode: "789012345678",
    expireDate: "2026-05-12",
    quantity: 10,
    supportType: "Return",
    assignedStaffId: "4",
    assignedStaffName: "Kyaw Kyaw",
    category: "Frozen Food"
  },
  {
    id: "7",
    name: "Ice Cream",
    barcode: "012345678901",
    expireDate: "2026-07-01",
    quantity: 18,
    supportType: "Non-Support",
    assignedStaffId: "4",
    assignedStaffName: "Kyaw Kyaw",
    category: "Frozen Food"
  }
];

export const mockProducts: Product[] = initialProducts.map(p => ({
  ...p,
  ...calculateProductFields(p.expireDate)
}));

export const mockAuditLogs: AuditLog[] = [];
