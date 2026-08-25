import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  KanbanSquare,
  Truck,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
};

export const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", Icon: Package },
  { to: "/orders", label: "Orders", Icon: ShoppingBag, end: true },
  { to: "/orders/board", label: "Order Board", Icon: KanbanSquare },
  { to: "/shipping", label: "Shiprocket", Icon: Truck },
  { to: "/customers", label: "Customers", Icon: Users },
  { to: "/settings", label: "Settings", Icon: Settings },
];
