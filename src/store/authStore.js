import { create } from "zustand";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const storedUser = safeParse(localStorage.getItem("alnour_user"));

// 🔥 Dev User (حل مؤقت)
const DEV_USER = {
  id: "dev-1",
  name: "Dev User",
  phone: "0000000000"
};

const useAuthStore = create((set) => ({
  user: storedUser || DEV_USER, // 🔥 هنا الحل
  isAuthenticated: true,        // 🔥 هنا الحل

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
