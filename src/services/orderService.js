import apiClient from "./apiClient";

export async function applyCoupon(payload) {
  const response = await apiClient.post("/api/checkout/apply-coupon", payload);
  return response?.data;
}

export async function applyPoints(payload) {
  const response = await apiClient.post("/api/checkout/apply-points", payload);
  return response?.data;
}

export async function confirmOrder(payload) {
  const response = await apiClient.post("/api/checkout/confirm", payload);
  return response?.data;
}

export async function getCustomerOrders(customerId) {
  const response = await apiClient.get(`/api/orders`, {
    params: { customerId }
  });
  return response?.data || [];
}

export async function getOrderDetails(orderId) {
  const response = await apiClient.get(`/api/orders/${orderId}`);
  return response?.data;
}

export async function createPaymentSession(payload) {
  try {
    const response = await apiClient.post("/api/payments/session", payload);
    return response?.data;
  } catch {
    return {
      success: true,
      providerSessionId: `SIM-${Date.now()}`,
      status: "mocked",
      paymentUrl: null
    };
  }
}

export async function getAdminOrders() {
  try {
    const response = await apiClient.get("/api/admin/orders");
    return response?.data || [];
  } catch {
    return [];
  }
}

export async function updateAdminOrderStatus(orderId, status) {
  try {
    const response = await apiClient.put(`/api/admin/orders/${orderId}/status`, {
      status
    });
    return response?.data;
  } catch {
    return {
      success: true,
      orderId,
      status,
      mocked: true
    };
  }
}


export async function submitRating(payload) {
  try {
    const response = await apiClient.post("/api/ratings", payload);
    return response?.data;
  } catch {
    return {
      success: true,
      mocked: true
    };
  }
}
const orderService = {
  applyCoupon,
  applyPoints,
  confirmOrder,
  getCustomerOrders,
  getOrderDetails,
  createPaymentSession,
  getAdminOrders,
  updateAdminOrderStatus
};

export default orderService;

