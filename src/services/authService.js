export async function login(phoneNumber, passwordPin) {
  return {
    success: true,
    token: "LOCAL_TOKEN",
    user: {
      id: "LOCAL_USER",
      name: "عميل صيدلية النور",
      phone: phoneNumber,
      role: "customer",
    },
  };
}

export default {
  login,
};
