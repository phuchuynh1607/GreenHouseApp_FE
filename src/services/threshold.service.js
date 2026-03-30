import axiosClient from "./apiClient";

// 1. Lấy ngưỡng đang có hiệu lực (đã tính ưu tiên)
export const fetchActiveThresholdsApi = async () => {
  try {
    const response = await axiosClient.get("/thresholds/active");
    return response.data;
  } catch (error) {
    console.error("Fetch active thresholds error:", error.message);
    throw error;
  }
};

// 2. Admin: Cài đặt ngưỡng mặc định
export const setAdminThresholdApi = async (sensorType, min, max) => {
  return (
    await axiosClient.post("/thresholds/admin", {
      sensor_type: sensorType,
      min_value: min,
      max_value: max,
    })
  ).data;
};
export const fetchAdminThresholdApi = async () => {
  try {
    const response = await axiosClient.get("/thresholds/admin/defaults");
    return response.data;
  } catch (error) {
    console.error("Fetch default thresholds error:", error.message);
    throw error;
  }
};

// 3. User: Cài đặt ngưỡng cá nhân
export const setUserThresholdApi = async (sensorType, min, max) => {
  return (
    await axiosClient.post("/thresholds/user", {
      sensor_type: sensorType,
      min_value: min,
      max_value: max,
    })
  ).data;
};

// 4. User: Xóa ngưỡng cá nhân để quay lại mặc định (DELETE)
export const resetToDefaultApi = async (sensorType) => {
  try {
    const response = await axiosClient.delete(`/thresholds/user/${sensorType}`);
    return response.data;
  } catch (error) {
    console.error(
      "Reset threshold error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
