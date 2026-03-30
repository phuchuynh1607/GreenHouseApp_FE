import axiosClient from "./apiClient";
import axios from "./apiClient";

const BASE_URL = axiosClient.defaults.baseURL;

export const registerUser = async (userData) => {
  try {
    const response = await axiosClient.post("/auth/", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const formData = `username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`;

    const response = await axiosClient.post("/auth/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken) => {
  return axios.post(`${BASE_URL}/auth/refresh`, null, {
    params: { refresh_token: refreshToken },
  });
};

export const fetchUserProfile = async () => {
  try {
    const response = await axiosClient.get("/users/");
    return response.data;
  } catch (error) {
    console.error(
      "Fetch user profile error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
