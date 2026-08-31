import { create } from "zustand";
import type { Customer } from "@/lib/types";
import { api } from "@/lib/api";

function splitName(name: string) {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return { firstName: firstName || "", lastName: rest.join(" ") };
}

type CustomerState = {
  customers: Customer[];
  loading: boolean;
  fetchCustomers: () => Promise<void>;
  getCustomer: (id: string) => Customer | undefined;
  updateCustomer: (id: string, patch: Partial<Customer>) => Promise<void>;
  removeCustomer: (id: string) => Promise<void>;
  setBlocked: (id: string, blocked: boolean) => Promise<void>;
};

export const useCustomerStore = create<CustomerState>()((set, get) => ({
  customers: [],
  loading: false,

  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const customers = await api.get<Customer[]>("/admin/customers");
      set({ customers, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  getCustomer: (id) => get().customers.find((c) => c.id === id),

  updateCustomer: async (id, patch) => {
    const body: Record<string, unknown> = { email: patch.email, phone: patch.phone };
    if (patch.name !== undefined) Object.assign(body, splitName(patch.name));
    const updated = await api.patch<Customer>(`/admin/customers/${id}`, body);
    set({ customers: get().customers.map((c) => (c.id === id ? updated : c)) });
  },

  removeCustomer: async (id) => {
    await api.delete(`/admin/customers/${id}`);
    set({ customers: get().customers.filter((c) => c.id !== id) });
  },

  setBlocked: async (id, blocked) => {
    const updated = await api.patch<Customer>(`/admin/customers/${id}/block`, { blocked });
    set({ customers: get().customers.map((c) => (c.id === id ? updated : c)) });
  },
}));
