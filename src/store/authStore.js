import { create } from "zustand";

const STORAGE_KEY = "alnour_user";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const storedUser = safeParse(localStorage.getItem(STORAGE_KEY));

const useAuthStore = create((set) => ({
  user: storedUser,
  isAuthenticated: Boolean(storedUser),

  login: ({ phone = "", name = "عميل صيدلية النور" } = {}) => {
    const user = {
      id: `LOCAL-${Date.now()}`,
      name,
      phone,
      role: "customer",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return user;
  },

  setUser: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
