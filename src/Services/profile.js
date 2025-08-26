import apiRequest from "./ApiRequest";

// Fetch user profile (id = 7 for now)
export const getProfile = () => {
  return apiRequest("GET", "/profile/7");
};

// Update user profile (name, email, password, etc.)
export const updateProfile = (data) => {
  return apiRequest("PUT", "/profile/7", data);
};

// Upload / update profile picture
export const updateProfilePicture = (data) => {
  return apiRequest("PUT", "/profile/7", data, {
    "Content-Type": "multipart/form-data",
  });
};
