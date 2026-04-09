import { create } from "zustand";

const storedUser = localStorage.getItem("alnour_user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const useAuthStore = create((set) => ({
  user: parsedUser,
  isAuthenticated: !!parsedUser,
  setUser: (user) => {
    localStorage.setItem("alnour_user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("alnour_user");
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
