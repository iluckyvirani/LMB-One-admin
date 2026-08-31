import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  KanbanSquare,
  Truck,
  Users,
  Settings,
  Mail,
  LayoutTemplate,
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
  { to: "/content", label: "Content", Icon: LayoutTemplate },
  { to: "/messages", label: "Messages", Icon: Mail },
  { to: "/settings", label: "Settings", Icon: Settings },
];
