import { create } from "zustand";

const USER_STORAGE_KEY = "alnour_user";

function safeParse(raw, fallback = null) {
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `ADDR-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCurrentCustomerId() {
  const user = safeParse(localStorage.getItem(USER_STORAGE_KEY));
  return user?.id || "guest";
}

function getAddressKey(customerId = getCurrentCustomerId()) {
  return `alnour_addresses_${customerId}`;
}

function normalizeAddress(address = {}, index = 0) {
  return {
    id: address.id || makeId(),
    label: address.label || "المنزل",
    fullName: address.fullName || "",
    phone: address.phone || "",
    country: address.country || "SA",
    city: address.city || "",
    district: address.district || "",
    street: address.street || "",
    buildingNo: address.buildingNo || "",
    floor: address.floor || "",
    apartment: address.apartment || "",
    notes: address.notes || "",
    latitude: address.latitude || "",
    longitude: address.longitude || "",
    isDefault: Boolean(address.isDefault || index === 0),
    createdAt: address.createdAt || new Date().toISOString(),
    updatedAt: address.updatedAt || new Date().toISOString(),
  };
}

function readInitialAddresses(customerId = getCurrentCustomerId()) {
  try {
    const raw = localStorage.getItem(getAddressKey(customerId));
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeAddress) : [];
  } catch {
    return [];
  }
}

function ensureOneDefault(addresses) {
  if (!addresses.length) return [];
  if (addresses.some((x) => x.isDefault)) return addresses;
  return addresses.map((x, index) => ({ ...x, isDefault: index === 0 }));
}

const useAccountStore = create((set, get) => ({
  customerId: getCurrentCustomerId(),
  addresses: readInitialAddresses(),

  setCustomer(customerId) {
    const id = customerId || getCurrentCustomerId();
    set({
      customerId: id,
      addresses: readInitialAddresses(id),
    });
  },

  persist() {
    localStorage.setItem(
      getAddressKey(get().customerId),
      JSON.stringify(get().addresses, null, 2),
    );
  },

  importAddresses(addresses = []) {
    const normalized = ensureOneDefault(
      Array.isArray(addresses)
        ? addresses.map((address, index) => normalizeAddress(address, index))
        : [],
    );

    set({ addresses: normalized });
    get().persist();
  },

  addAddress(address) {
    const item = normalizeAddress(address, get().addresses.length);

    let next = [...get().addresses];

    if (item.isDefault || next.length === 0) {
      next = next.map((x) => ({ ...x, isDefault: false }));
      item.isDefault = true;
    }

    next.unshift(item);
    next = ensureOneDefault(next);

    set({ addresses: next });
    get().persist();

    return item;
  },

  updateAddress(id, payload) {
    let next = get().addresses.map((item) =>
      item.id === id
        ? normalizeAddress(
            {
              ...item,
              ...payload,
              id,
              updatedAt: new Date().toISOString(),
            },
            0,
          )
        : item,
    );

    if (payload.isDefault) {
      next = next.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }));
    }

    next = ensureOneDefault(next);

    set({ addresses: next });
    get().persist();

    return next.find((x) => x.id === id) || null;
  },

  deleteAddress(id) {
    let next = get().addresses.filter((item) => item.id !== id);
    next = ensureOneDefault(next);

    set({ addresses: next });
    get().persist();

    return next;
  },

  setDefaultAddress(id) {
    const next = get().addresses.map((item) => ({
      ...item,
      isDefault: item.id === id,
      updatedAt: item.id === id ? new Date().toISOString() : item.updatedAt,
    }));

    set({ addresses: next });
    get().persist();

    return next.find((x) => x.id === id) || null;
  },
}));

export default useAccountStore;
