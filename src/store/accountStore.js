import { create } from "zustand";

const STORAGE_KEY = "alnour_addresses";

const readInitialAddresses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const useAccountStore = create((set, get) => ({
  addresses: readInitialAddresses(),

  persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(get().addresses));
  },

  addAddress(address) {
    const item = {
      id: crypto.randomUUID(),
      label: address.label || "المنزل",
      fullName: address.fullName || "",
      phone: address.phone || "",
      country: address.country || "Saudi Arabia",
      city: address.city || "",
      district: address.district || "",
      street: address.street || "",
      buildingNo: address.buildingNo || "",
      floor: address.floor || "",
      apartment: address.apartment || "",
      notes: address.notes || "",
      latitude: address.latitude || "",
      longitude: address.longitude || "",
      isDefault: Boolean(address.isDefault),
      createdAt: new Date().toISOString(),
    };

    let next = [...get().addresses];

    if (item.isDefault) {
      next = next.map((x) => ({ ...x, isDefault: false }));
    }

    next.unshift(item);

    if (next.length === 1) {
      next[0].isDefault = true;
    }

    set({ addresses: next });
    get().persist();
  },

  updateAddress(id, payload) {
    let next = get().addresses.map((item) =>
      item.id === id ? { ...item, ...payload } : item,
    );

    if (payload.isDefault) {
      next = next.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }));
    }

    set({ addresses: next });
    get().persist();
  },

  deleteAddress(id) {
    let next = get().addresses.filter((item) => item.id !== id);

    if (next.length > 0 && !next.some((x) => x.isDefault)) {
      next[0].isDefault = true;
    }

    set({ addresses: next });
    get().persist();
  },

  setDefaultAddress(id) {
    const next = get().addresses.map((item) => ({
      ...item,
      isDefault: item.id === id,
    }));

    set({ addresses: next });
    get().persist();
  },
}));

export default useAccountStore;

