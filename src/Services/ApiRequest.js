import axios from "axios";

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.BASE_URL ,
  headers: {
    "Content-Type": "application/json",
  },
});


const apiRequest = async (method, route, data = {}, customHeaders = {}) => {
  try {
    const response = await apiClient({
      method,
      url: route,
      data: ["POST", "PUT", "PATCH"].includes(method.toUpperCase()) ? data : undefined,
      headers: { ...customHeaders },
    });
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export default apiRequest;
