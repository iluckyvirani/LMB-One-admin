import { create } from "zustand";
import type { Order, OrderStatus } from "@/lib/types";
import { api } from "@/lib/api";

type OrderState = {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
};

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const orders = await api.get<Order[]>("/admin/orders");
      set({ orders, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    const updated = await api.patch<Order>(`/admin/orders/${id}/status`, { status });
    set({ orders: get().orders.map((o) => (o.id === id ? updated : o)) });
  },

  getOrder: (id) => get().orders.find((o) => o.id === id),
}));
