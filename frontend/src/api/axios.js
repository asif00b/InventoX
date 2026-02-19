import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");

  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("FULL ERROR:", error.response?.data);

    if (error.response?.status === 401) {
      console.warn("Unauthorized - Redirecting to login...");
    }

    return Promise.reject(error);
  }
);

export default api;
