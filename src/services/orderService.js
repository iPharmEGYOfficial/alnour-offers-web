const STORAGE_KEY = "alnour_orders";

function readOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export async function applyCoupon(payload) {
  return { success: true, discount: 0, payload };
}

export async function applyPoints(payload) {
  return { success: true, pointsDiscount: 0, payload };
}

export async function confirmOrder(payload) {
  const order = {
    ...payload,
    orderNo: payload.orderNo || `AN-${Date.now()}`,
    id: payload.orderNo || `AN-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  const orders = readOrders();
  saveOrders([order, ...orders]);

  return { success: true, order };
}

export async function getCustomerOrders() {
  return readOrders();
}

export async function getOrderDetails(orderId) {
  return readOrders().find((x) => String(x.orderNo) === String(orderId) || String(x.id) === String(orderId)) || null;
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
      ? { ...order, status }
      : order
  );

  saveOrders(orders);

  return { success: true, orderId, status };
}

export async function submitRating(payload) {
  const orders = readOrders().map((order) =>
    String(order.orderNo) === String(payload.orderNo)
      ? { ...order, ratingSubmitted: true, rating: payload }
      : order
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
