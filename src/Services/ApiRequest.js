import axios from "axios";

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    "Content-Type": "application/json",
  },
});

const apiRequest = async (method, route, data = {}, customConfig = {}) => {
  try {
    const token = localStorage.getItem("token");
    const isFormData = data instanceof FormData;

    const response = await apiClient({
      method,
      url: route,
      data: ["POST", "PUT", "PATCH"].includes(method.toUpperCase()) ? data : undefined,
      params: customConfig.params || {}, // ✅ Pass params separately
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        ...(customConfig.headers || {}), // ✅ Merge any extra headers
      },
    });

    return response.data;
  } catch (error) {
    // console.log(error);
    console.error("API Request Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export default apiRequest;
