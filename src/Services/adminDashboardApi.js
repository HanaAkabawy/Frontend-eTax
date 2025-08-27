import apiRequest from "./ApiRequest";

// Get users registered this month
export const getUsersThisMonth = () => {
  return apiRequest("GET", "/stats/users-this-month");
};

// Get posts created today
export const getPostsToday = () => {
  return apiRequest("GET", "/stats/posts-today");
};

// Get revenue by subscription
export const getRevenueBySubscription = () => {
  return apiRequest("GET", "/revenue/subscriptions");
};
