import { create } from "zustand";

const STORAGE_KEY = "alnour_cart";

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const useCartStore = create((set, get) => ({
  items: readCart(),

  persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(get().items));
  },

  addToCart: (product) => {
    const items = [...get().items];
    const index = items.findIndex((x) => x.productID === product.productID);
    const stock = Number(product.stockQty || 0);

    if (index > -1) {
      if (items[index].qty < stock) {
        items[index].qty += 1;
      }
    } else {
      items.push({ ...product, qty: 1, stockQty: stock });
    }

    set({ items });
    get().persist();
  },

  increaseQty: (productID) => {
    const items = get().items.map((item) => {
      const stock = Number(item.stockQty || 0);
      if (item.productID === productID && item.qty < stock) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });

    set({ items });
    get().persist();
  },

  decreaseQty: (productID) => {
    const items = get()
      .items
      .map((item) =>
        item.productID === productID
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0);

    set({ items });
    get().persist();
  },

  clearCart: () => {
    set({ items: [] });
    localStorage.removeItem(STORAGE_KEY);
  }
}));

export default useCartStore;