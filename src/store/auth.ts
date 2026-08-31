import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiError, setToken } from "@/lib/api";

export const DEMO_CREDENTIALS = { email: "admin@lmbshoes.com", password: "admin123" };

type LoginResponse = {
  token: string;
  admin: { id: number; email: string; name: string };
};

type AuthState = {
  isLoggedIn: boolean;
  name: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      name: null,
      email: null,

      login: async (email, password) => {
        try {
          const { token, admin } = await api.post<LoginResponse>("/admin/login", {
            email,
            password,
          });
          setToken(token);
          set({ isLoggedIn: true, name: admin.name, email: admin.email });
          return { ok: true as const };
        } catch (err) {
          const message = err instanceof ApiError ? err.message : "Could not reach the server";
          return { ok: false as const, error: message };
        }
      },

      logout: () => {
        setToken(null);
        set({ isLoggedIn: false, name: null, email: null });
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          await api.post("/admin/change-password", { currentPassword, newPassword });
          return { ok: true as const };
        } catch (err) {
          const message = err instanceof ApiError ? err.message : "Could not reach the server";
          return { ok: false as const, error: message };
        }
      },
    }),
    { name: "lmb-admin-auth" },
  ),
);
