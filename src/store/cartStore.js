import { create } from "zustand";

const USER_STORAGE_KEY = "alnour_user";

function safeParse(raw, fallback = null) {
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

function getCurrentCustomerId() {
  const user = safeParse(localStorage.getItem(USER_STORAGE_KEY));
  return user?.id || "guest";
}

function getCartKey(customerId = getCurrentCustomerId()) {
  return `alnour_cart_${customerId}`;
}

function readCart(customerId = getCurrentCustomerId()) {
  try {
    const raw = localStorage.getItem(getCartKey(customerId));
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const useCartStore = create((set, get) => ({
  customerId: getCurrentCustomerId(),
  items: readCart(),

  setCustomer(customerId) {
    const id = customerId || getCurrentCustomerId();
    set({
      customerId: id,
      items: readCart(id),
    });
  },

  persist() {
    localStorage.setItem(getCartKey(get().customerId), JSON.stringify(get().items));
  },

  addToCart(product) {
    const items = [...get().items];
    const productID = product.productID || product.productId || product.id;
    const index = items.findIndex((x) => String(x.productID) === String(productID));
    const stock = Number(product.stockQty ?? product.stock ?? 999999);

    if (index > -1) {
      if (stock <= 0 || items[index].qty < stock) {
        items[index].qty += 1;
      }
    } else {
      items.push({
        ...product,
        productID,
        productId: productID,
        qty: 1,
        stockQty: stock,
      });
    }

    set({ items });
    get().persist();
  },

  addItem(product) {
    get().addToCart(product);
  },

  increaseQty(productID) {
    const items = get().items.map((item) => {
      const stock = Number(item.stockQty || 999999);

      if (String(item.productID) === String(productID) && item.qty < stock) {
        return { ...item, qty: item.qty + 1 };
      }

      return item;
    });

    set({ items });
    get().persist();
  },

  decreaseQty(productID) {
    const items = get()
      .items.map((item) =>
        String(item.productID) === String(productID)
          ? { ...item, qty: item.qty - 1 }
          : item,
      )
      .filter((item) => item.qty > 0);

    set({ items });
    get().persist();
  },

  removeItem(productID) {
    const items = get().items.filter(
      (item) => String(item.productID) !== String(productID),
    );
    set({ items });
    get().persist();
  },

  clearCart() {
    set({ items: [] });
    localStorage.removeItem(getCartKey(get().customerId));
  },

  getCartCount() {
    return get().items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  },

  getCartTotal() {
    return get().items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
      0,
    );
  },
}));

export default useCartStore;
