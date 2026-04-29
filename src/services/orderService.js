const ORDERS_KEY = "alnour_orders";
const USER_STORAGE_KEY = "alnour_user";

function safeParse(raw, fallback = null) {
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

function getCurrentUser() {
  return safeParse(localStorage.getItem(USER_STORAGE_KEY), null);
}

function readOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function applyCoupon(payload) {
  return { success: true, discount: 0, payload };
}

export async function applyPoints(payload) {
  return { success: true, pointsDiscount: 0, payload };
}

export async function confirmOrder(payload) {
  const user = getCurrentUser();
  const orderNo = payload.orderNo || `AN-${Date.now()}`;

  const order = {
    ...payload,
    orderNo,
    id: payload.id || orderNo,
    customerId: payload.customerId || user?.id || "guest",
    customerName: payload.customerName || user?.name || payload.address?.fullName || "عميل",
    customerPhone: payload.customerPhone || user?.phone || payload.address?.phone || "",
    status: payload.status || "new",
    stepStatus: {
      cart: true,
      address: true,
      country: true,
      payment: true,
      review: true,
      success: true,
    },
    createdAt: payload.createdAt || new Date().toISOString(),
  };

  const orders = readOrders();
  saveOrders([order, ...orders]);

  return { success: true, order };
}

export async function getCustomerOrders() {
  const user = getCurrentUser();
  const orders = readOrders();

  if (!user?.id) return orders.filter((order) => !order.customerId || order.customerId === "guest");

  return orders.filter((order) => String(order.customerId) === String(user.id));
}

export async function getOrderDetails(orderId) {
  return (
    readOrders().find(
      (x) => String(x.orderNo) === String(orderId) || String(x.id) === String(orderId),
    ) || null
  );
}

export async function createPaymentSession(payload) {
  return {
    success: true,
    providerSessionId: `LOCAL-${Date.now()}`,
    status: "local",
    paymentUrl: null,
    payload,
  };
}

export async function getAdminOrders() {
  return readOrders();
}

export async function updateAdminOrderStatus(orderId, status) {
  const orders = readOrders().map((order) =>
    String(order.orderNo) === String(orderId) || String(order.id) === String(orderId)
      ? { ...order, status, updatedAt: new Date().toISOString() }
      : order,
  );

  saveOrders(orders);

  return { success: true, orderId, status };
}

export async function submitRating(payload) {
  const orders = readOrders().map((order) =>
    String(order.orderNo) === String(payload.orderNo) || String(order.id) === String(payload.orderNo)
      ? { ...order, ratingSubmitted: true, rating: payload, ratedAt: new Date().toISOString() }
      : order,
  );

  saveOrders(orders);

  return { success: true, payload };
}

const orderService = {
  applyCoupon,
  applyPoints,
  confirmOrder,
  getCustomerOrders,
  getOrderDetails,
  createPaymentSession,
  getAdminOrders,
  updateAdminOrderStatus,
  submitRating,
};

export default orderService;
