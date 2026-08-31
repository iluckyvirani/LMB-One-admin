import { create } from "zustand";
import { api } from "@/lib/api";

export type StoreSettings = {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  gstin: string;
  taxPercent: number;
  codEnabled: boolean;
  codMaxAmount: number;
  freeShippingThreshold: number;
  shippingFee: number;
  deliveryEtaMinDays: number;
  deliveryEtaMaxDays: number;
  newsletterHeading: string;
  newsletterSubtext: string;
  shiprocket: {
    enabled: boolean;
    email: string;
    apiKey: string;
    channelId: string;
    pickupPincode: string;
  };
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "LMB Shoes",
  tagline: "Step into luxury",
  supportEmail: "support@lmbshoes.com",
  supportPhone: "+91 98765 43210",
  whatsapp: "919876543210",
  gstin: "",
  taxPercent: 12,
  codEnabled: true,
  codMaxAmount: 10000,
  freeShippingThreshold: 0,
  shippingFee: 99,
  deliveryEtaMinDays: 3,
  deliveryEtaMaxDays: 7,
  newsletterHeading: "Get 10% off your first order",
  newsletterSubtext: "Sign up for drops, restocks and members-only offers.",
  shiprocket: {
    enabled: false,
    email: "",
    apiKey: "",
    channelId: "",
    pickupPincode: "",
  },
};

type SettingsState = {
  settings: StoreSettings;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (patch: Partial<StoreSettings>) => Promise<void>;
  updateShiprocket: (patch: Partial<StoreSettings["shiprocket"]>) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>()((set) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const settings = await api.get<StoreSettings>("/admin/settings");
      set({ settings, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  updateSettings: async (patch) => {
    const settings = await api.put<StoreSettings>("/admin/settings", patch);
    set({ settings });
  },

  updateShiprocket: async (patch) => {
    const settings = await api.patch<StoreSettings>("/admin/settings/shiprocket", patch);
    set({ settings });
  },
}));
