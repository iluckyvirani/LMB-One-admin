import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";
import { INITIAL_PRODUCTS } from "@/lib/mockData";

type ProductState = {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => string;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
};

function newId() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      addProduct: (product) => {
        const id = newId();
        set({ products: [{ ...product, id }, ...get().products] });
        return id;
      },
      updateProduct: (id, patch) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        });
      },
      removeProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },
      getProduct: (id) => get().products.find((p) => p.id === id),
    }),
    { name: "lmb-admin-products" },
  ),
);
