import { create } from "zustand";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const storedUser = safeParse(localStorage.getItem("alnour_user"));

const useAuthStore = create((set) => ({
  user: storedUser,
  isAuthenticated: !!storedUser,

  setUser: (user) => {
    localStorage.setItem("alnour_user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("alnour_user");
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;