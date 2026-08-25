import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEMO_EMAIL = "admin@lmbshoes.com";
const DEMO_PASSWORD = "admin123";

type AuthState = {
  isLoggedIn: boolean;
  name: string | null;
  email: string | null;
  password: string;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => { ok: true } | { ok: false; error: string };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      name: null,
      email: null,
      password: DEMO_PASSWORD,
      login: (email, password) => {
        if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== get().password) {
          return {
            ok: false as const,
            error: `Invalid credentials. Demo login: ${DEMO_EMAIL} / ${get().password}`,
          };
        }
        set({ isLoggedIn: true, name: "Admin", email });
        return { ok: true as const };
      },
      logout: () => set({ isLoggedIn: false, name: null, email: null }),
      changePassword: (currentPassword, newPassword) => {
        if (currentPassword !== get().password) {
          return { ok: false as const, error: "Current password is incorrect." };
        }
        if (newPassword.trim().length < 6) {
          return {
            ok: false as const,
            error: "New password must be at least 6 characters.",
          };
        }
        set({ password: newPassword });
        return { ok: true as const };
      },
    }),
    { name: "lmb-admin-auth" },
  ),
);

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
