import { create } from "zustand";
import type { Product } from "@/lib/types";
import { api } from "@/lib/api";

type ProductState = {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<string>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  uploadImage: (file: File) => Promise<string>;
};

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const products = await api.get<Product[]>("/products?limit=200");
      set({ products, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  addProduct: async (product) => {
    const created = await api.post<Product>("/admin/products", product);
    set({ products: [created, ...get().products] });
    return created.id;
  },

  updateProduct: async (id, patch) => {
    const updated = await api.put<Product>(`/admin/products/${id}`, patch);
    set({ products: get().products.map((p) => (p.id === id ? updated : p)) });
  },

  removeProduct: async (id) => {
    await api.delete(`/admin/products/${id}`);
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  getProduct: (id) => get().products.find((p) => p.id === id),

  uploadImage: async (file) => {
    const { url } = await api.upload<{ url: string }>("/admin/products/upload-image", file);
    return url;
  },
}));
