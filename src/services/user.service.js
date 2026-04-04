import axios from "./apiClient";
import { Platform } from "react-native";
import axiosClient from "./apiClient";
import { fetchUserProfile } from "./auth.service";
import { tokenStorage } from "../tokenStorage/tokenStorage";
export const fetchUserInfo = fetchUserProfile;

// Cập nhật thông tin
export const updateUserInfo = async (updateData) => {
  const response = await axiosClient.put(
    "/users/change_information",
    updateData,
  );
  return response.data;
};

export const uploadAvatarApi = async (imageUri) => {
  const formData = new FormData();

  const filename = imageUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const ext = match ? match[1] : "jpg";
  const type = `image/${ext === "jpg" ? "jpeg" : ext}`;

  formData.append("file", {
    uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
    name: filename || `avatar.${ext}`,
    type: type,
  });
  const response = await axiosClient.post("/users/upload/", formData, {
    headers: {
      Accept: "application/json",
    },
    transformRequest: (data) => data,
  });

  return response.data;
};

export const changePasswordApi = async (passwordData) => {
  try {
    const response = await axiosClient.put("/users/password", passwordData);
    console.log("Response status:", response.status);
    return response.data;
  } catch (error) {
    console.error("Change password error details:");
    throw error;
  }
};
export const fetchLoginHistory = async () => {
  try {
    const response = await axiosClient.get("/users/login-history");
    return response.data;
  } catch (error) {
    console.error(
      "Fetch login history error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
