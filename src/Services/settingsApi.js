import apiRequest from "./ApiRequest";

// Fetch all settings
export const getSettings = () => {
  return apiRequest("GET", "/settings");
};

// Create a new setting
export const createSetting = (data) => {
  return apiRequest("POST", "/settings", data);
};

// Update an existing setting
export const updateSetting = (id, data) => {
  return apiRequest("PUT", `/settings/${id}`, data);
};

// Delete a setting
export const deleteSetting = (id) => {
  return apiRequest("DELETE", `/settings/${id}`);
};
