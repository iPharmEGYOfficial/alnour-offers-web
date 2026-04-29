import customers from "../data/customers.json";

const CUSTOMERS_STORAGE_KEY = "alnour_customers";

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "").trim();
}

function readCustomCustomers() {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getAllCustomers() {
  const merged = [...customers, ...readCustomCustomers()];
  const seen = new Set();

  return merged.filter((customer) => {
    const key = normalizePhone(customer.phone);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function findCustomerByPhone(phone) {
  const normalized = normalizePhone(phone);
  return (
    getAllCustomers().find((customer) => normalizePhone(customer.phone) === normalized) ||
    null
  );
}

export function getCustomerById(id) {
  return getAllCustomers().find((customer) => String(customer.id) === String(id)) || null;
}

export function createLocalCustomer({ name, phone, country = "SA" }) {
  const customer = {
    id: `CUS-${Date.now()}`,
    name: name || "عميل صيدلية النور",
    phone: normalizePhone(phone),
    country,
    addresses: [],
    paymentMethods: [],
    orders: [],
    ratings: [],
    createdAt: new Date().toISOString(),
  };

  const current = readCustomCustomers();
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify([customer, ...current]));
  return customer;
}

export default {
  findCustomerByPhone,
  getCustomerById,
  createLocalCustomer,
};
