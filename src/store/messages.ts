import { create } from "zustand";
import { api } from "@/lib/api";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type MessagesState = {
  messages: ContactMessage[];
  loading: boolean;
  fetchMessages: () => Promise<void>;
  removeMessage: (id: number) => Promise<void>;
};

export const useMessagesStore = create<MessagesState>()((set, get) => ({
  messages: [],
  loading: false,

  fetchMessages: async () => {
    set({ loading: true });
    try {
      const messages = await api.get<ContactMessage[]>("/admin/contact-messages");
      set({ messages, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  removeMessage: async (id) => {
    await api.delete(`/admin/contact-messages/${id}`);
    set({ messages: get().messages.filter((m) => m.id !== id) });
  },
}));
