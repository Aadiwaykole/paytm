import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => api.post("/user/signup", data);
export const signin = (data) => api.post("/user/signin", data);
export const getBalance = () => api.get("/account/balance");
export const searchUsers = (filter) =>
  api.get("/user/bulk", { params: { filter } });
export const transferMoney = (data) => api.post("/user/transfer", data);
export const updateProfile = (data) => api.put("/user/", data);

export default api;
