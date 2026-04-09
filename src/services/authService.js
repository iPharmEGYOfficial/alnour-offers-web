import apiClient from "./apiClient";

export async function login(phoneNumber, passwordPin) {
  const response = await apiClient.post("/api/auth/login", {
    phoneNumber,
    passwordPin,
  });
  return response.data;
}
