import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Ej: "http://localhost:5193/api"
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: adjunta token automáticamente
api.interceptors.request.use(config => {
  const session = localStorage.getItem("session");
  if (session) {
    const user = JSON.parse(session);
    if (user.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
