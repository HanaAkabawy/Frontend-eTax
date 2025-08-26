import axios from "axios";

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api' ,
  // headers: {
  //  "Content-Type": "application/json",
  // },
});


const apiRequest = async (method, route, data = {}, customHeaders = {}) => {
  
  try {
    console.log(customHeaders);
    const isFormData = data instanceof FormData;
        //  for (let [key, value] of data.entries()) {
        //   console.log(key, value);
        // }
    const response = await apiClient({
      method,
      url: route,
      data: ["POST", "PUT", "PATCH"].includes(method.toUpperCase()) ? data : undefined,
      headers: { 
           "Content-Type": "application/json",
            ...customHeaders 
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
