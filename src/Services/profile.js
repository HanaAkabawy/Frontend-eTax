import apiRequest from "./ApiRequest";

// Fetch logged-in user profile
export const getProfile = (config = {}) => { 
  console.log(config);
  return apiRequest("GET", "/profile", null, config);
};

// Update logged-in user profile (name, email, password, etc.)
export const updateProfile = (data, config = {}) => {
  return apiRequest("PUT", "/profile", data, config);
};

// Upload / update profile picture
export const updateProfilePicture = (data, config = {}) => {
  return apiRequest("PUT", "/profile", data, {
    ...config,
    "Content-Type": "multipart/form-data",
  });
};
