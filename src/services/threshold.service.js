import axiosClient from "./apiClient";

//fetch Threshold (user custom >> admin)
export const fetchActiveThresholdsApi = async () => {
  try {
    const response = await axiosClient.get("/thresholds/active");
    return response.data;
  } catch (error) {
    console.error("Fetch active thresholds error:", error.message);
    throw error;
  }
};

// admin threshold (system threshold)
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

// user custom threshold
export const setUserThresholdApi = async (sensorType, min, max) => {
  return (
    await axiosClient.post("/thresholds/user", {
      sensor_type: sensorType,
      min_value: min,
      max_value: max,
    })
  ).data;
};

// delete user custom threshold
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
