import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if(originalRequest._retry){
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;
       
      try {
        const refreshRes = await api.post("/users/refresh-token", {});
        
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err.response?.data?.message || err.message);
        
        // Clear auth state before redirecting
        localStorage.removeItem("user");
        sessionStorage.clear();
        
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(err);
      }  
    }

    return Promise.reject(error);
  },
);

export default api;
