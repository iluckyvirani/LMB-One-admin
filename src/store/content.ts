import { create } from "zustand";
import { api } from "@/lib/api";

export type Banner = {
  id: number;
  href: string;
  image: string | null;
  swatch: [string, string];
  badge: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  position: number;
  active: boolean;
};

export type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  position: number;
  active: boolean;
};

export type TrustItem = {
  id: number;
  icon: string;
  label: string;
  description: string;
  position: number;
  active: boolean;
};

export type BankOffer = {
  id: number;
  title: string;
  detail: string;
  position: number;
  active: boolean;
};

type ContentState = {
  banners: Banner[];
  testimonials: Testimonial[];
  trustItems: TrustItem[];
  bankOffers: BankOffer[];
  loading: boolean;

  fetchAll: () => Promise<void>;

  addBanner: (b: Omit<Banner, "id">) => Promise<void>;
  updateBanner: (id: number, patch: Partial<Banner>) => Promise<void>;
  removeBanner: (id: number) => Promise<void>;
  uploadBannerImage: (file: File) => Promise<string>;

  addTestimonial: (t: Omit<Testimonial, "id">) => Promise<void>;
  updateTestimonial: (id: number, patch: Partial<Testimonial>) => Promise<void>;
  removeTestimonial: (id: number) => Promise<void>;

  addTrustItem: (t: Omit<TrustItem, "id">) => Promise<void>;
  updateTrustItem: (id: number, patch: Partial<TrustItem>) => Promise<void>;
  removeTrustItem: (id: number) => Promise<void>;

  addBankOffer: (o: Omit<BankOffer, "id">) => Promise<void>;
  updateBankOffer: (id: number, patch: Partial<BankOffer>) => Promise<void>;
  removeBankOffer: (id: number) => Promise<void>;
};

export const useContentStore = create<ContentState>()((set, get) => ({
  banners: [],
  testimonials: [],
  trustItems: [],
  bankOffers: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const [banners, testimonials, trustItems, bankOffers] = await Promise.all([
        api.get<Banner[]>("/admin/banners"),
        api.get<Testimonial[]>("/admin/testimonials"),
        api.get<TrustItem[]>("/admin/trust-items"),
        api.get<BankOffer[]>("/admin/bank-offers"),
      ]);
      set({ banners, testimonials, trustItems, bankOffers, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  addBanner: async (b) => {
    const created = await api.post<Banner>("/admin/banners", b);
    set({ banners: [...get().banners, created] });
  },
  updateBanner: async (id, patch) => {
    const updated = await api.put<Banner>(`/admin/banners/${id}`, patch);
    set({ banners: get().banners.map((b) => (b.id === id ? updated : b)) });
  },
  removeBanner: async (id) => {
    await api.delete(`/admin/banners/${id}`);
    set({ banners: get().banners.filter((b) => b.id !== id) });
  },
  uploadBannerImage: async (file) => {
    const { url } = await api.upload<{ url: string }>("/admin/products/upload-image", file);
    return url;
  },

  addTestimonial: async (t) => {
    const created = await api.post<Testimonial>("/admin/testimonials", t);
    set({ testimonials: [...get().testimonials, created] });
  },
  updateTestimonial: async (id, patch) => {
    const updated = await api.put<Testimonial>(`/admin/testimonials/${id}`, patch);
    set({ testimonials: get().testimonials.map((t) => (t.id === id ? updated : t)) });
  },
  removeTestimonial: async (id) => {
    await api.delete(`/admin/testimonials/${id}`);
    set({ testimonials: get().testimonials.filter((t) => t.id !== id) });
  },

  addTrustItem: async (t) => {
    const created = await api.post<TrustItem>("/admin/trust-items", t);
    set({ trustItems: [...get().trustItems, created] });
  },
  updateTrustItem: async (id, patch) => {
    const updated = await api.put<TrustItem>(`/admin/trust-items/${id}`, patch);
    set({ trustItems: get().trustItems.map((t) => (t.id === id ? updated : t)) });
  },
  removeTrustItem: async (id) => {
    await api.delete(`/admin/trust-items/${id}`);
    set({ trustItems: get().trustItems.filter((t) => t.id !== id) });
  },

  addBankOffer: async (o) => {
    const created = await api.post<BankOffer>("/admin/bank-offers", o);
    set({ bankOffers: [...get().bankOffers, created] });
  },
  updateBankOffer: async (id, patch) => {
    const updated = await api.put<BankOffer>(`/admin/bank-offers/${id}`, patch);
    set({ bankOffers: get().bankOffers.map((o) => (o.id === id ? updated : o)) });
  },
  removeBankOffer: async (id) => {
    await api.delete(`/admin/bank-offers/${id}`);
    set({ bankOffers: get().bankOffers.filter((o) => o.id !== id) });
  },
}));
