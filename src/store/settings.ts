import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  deliveryEtaMinDays: number;
  deliveryEtaMaxDays: number;
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
  deliveryEtaMinDays: 3,
  deliveryEtaMaxDays: 7,
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
  updateSettings: (patch: Partial<StoreSettings>) => void;
  updateShiprocket: (patch: Partial<StoreSettings["shiprocket"]>) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      updateShiprocket: (patch) =>
        set({
          settings: {
            ...get().settings,
            shiprocket: { ...get().settings.shiprocket, ...patch },
          },
        }),
    }),
    { name: "lmb-admin-settings" },
  ),
);
