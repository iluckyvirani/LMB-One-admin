import { create } from "zustand";
import type { Shipment, ShipmentStatus } from "@/lib/types";
import { api } from "@/lib/api";

type ShipmentState = {
  shipments: Shipment[];
  loading: boolean;
  fetchShipments: () => Promise<void>;
  getShipment: (orderId: string) => Shipment | undefined;
  assignAwb: (orderId: string, courier: string) => Promise<void>;
  updateStatus: (orderId: string, status: ShipmentStatus) => Promise<void>;
};

export const useShipmentStore = create<ShipmentState>()((set, get) => ({
  shipments: [],
  loading: false,

  fetchShipments: async () => {
    set({ loading: true });
    try {
      const shipments = await api.get<Shipment[]>("/admin/shipments");
      set({ shipments, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  getShipment: (orderId) => get().shipments.find((s) => s.orderId === orderId),

  assignAwb: async (orderId, courier) => {
    const updated = await api.post<Shipment>(`/admin/shipments/${orderId}/assign-awb`, {
      courier,
    });
    const exists = get().shipments.some((s) => s.orderId === orderId);
    set({
      shipments: exists
        ? get().shipments.map((s) => (s.orderId === orderId ? updated : s))
        : [...get().shipments, updated],
    });
  },

  updateStatus: async (orderId, status) => {
    const updated = await api.patch<Shipment>(`/admin/shipments/${orderId}/status`, { status });
    set({
      shipments: get().shipments.map((s) => (s.orderId === orderId ? updated : s)),
    });
  },
}));
