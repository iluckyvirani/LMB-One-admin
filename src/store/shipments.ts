import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Shipment, ShipmentStatus } from "@/lib/types";
import { INITIAL_SHIPMENTS } from "@/lib/mockData";

function newAwb(courier: string) {
  const prefix = courier.slice(0, 2).toUpperCase();
  const num = Math.floor(100000000 + Math.random() * 899999999);
  return `${prefix}${num}`;
}

type ShipmentState = {
  shipments: Shipment[];
  getShipment: (orderId: string) => Shipment | undefined;
  assignAwb: (orderId: string, courier: string) => void;
  updateStatus: (orderId: string, status: ShipmentStatus) => void;
};

export const useShipmentStore = create<ShipmentState>()(
  persist(
    (set, get) => ({
      shipments: INITIAL_SHIPMENTS,
      getShipment: (orderId) => get().shipments.find((s) => s.orderId === orderId),
      assignAwb: (orderId, courier) => {
        const awbCode = newAwb(courier);
        const exists = get().shipments.some((s) => s.orderId === orderId);
        const updated: Shipment = {
          orderId,
          courier,
          awbCode,
          status: "awb_assigned",
          lastUpdate: new Date().toISOString(),
        };
        set({
          shipments: exists
            ? get().shipments.map((s) => (s.orderId === orderId ? updated : s))
            : [...get().shipments, updated],
        });
      },
      updateStatus: (orderId, status) => {
        set({
          shipments: get().shipments.map((s) =>
            s.orderId === orderId
              ? { ...s, status, lastUpdate: new Date().toISOString() }
              : s,
          ),
        });
      },
    }),
    { name: "lmb-admin-shipments" },
  ),
);
