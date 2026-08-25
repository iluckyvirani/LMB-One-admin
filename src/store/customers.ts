import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "@/lib/types";
import { INITIAL_CUSTOMERS } from "@/lib/mockData";

type CustomerState = {
  customers: Customer[];
  getCustomer: (id: string) => Customer | undefined;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  setBlocked: (id: string, blocked: boolean) => void;
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: INITIAL_CUSTOMERS,
      getCustomer: (id) => get().customers.find((c) => c.id === id),
      updateCustomer: (id, patch) => {
        set({
          customers: get().customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        });
      },
      removeCustomer: (id) => {
        set({ customers: get().customers.filter((c) => c.id !== id) });
      },
      setBlocked: (id, blocked) => {
        set({
          customers: get().customers.map((c) => (c.id === id ? { ...c, blocked } : c)),
        });
      },
    }),
    { name: "lmb-admin-customers" },
  ),
);
