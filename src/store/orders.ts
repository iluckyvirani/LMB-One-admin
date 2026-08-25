import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/lib/types";
import { INITIAL_ORDERS } from "@/lib/mockData";

type OrderState = {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => Order | undefined;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,
      updateStatus: (id, status) => {
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
        });
      },
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "lmb-admin-orders" },
  ),
);
