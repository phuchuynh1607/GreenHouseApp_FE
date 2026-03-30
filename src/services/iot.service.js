import axiosClient from "./apiClient";

/**
 * 1. Lấy dữ liệu cảm biến mới nhất (Dashboard)
 */
export const fetchLatestSensorData = async () => {
  try {
    const response = await axiosClient.get("/iot/latest-data");
    return response.data;
  } catch (error) {
    console.error("Fetch IoT data error:", error.message);
    throw error;
  }
};

/**
 * 2. Lấy lịch sử cảm biến (Dùng để vẽ biểu đồ)
 * @param {number} hours - Số giờ muốn lấy lịch sử (mặc định 24)
 */
export const fetchSensorHistory = async (hours = 24) => {
  try {
    const response = await axiosClient.get("/iot/sensor-history", {
      params: { hours }, // Gửi query param ?hours=24
    });
    return response.data;
  } catch (error) {
    console.error("Fetch Sensor History Error:", error.message);
    throw error;
  }
};

/**
 * 3. Lấy trạng thái tất cả thiết bị (Bơm, Quạt, Đèn)
 */
export const fetchAllDevices = async () => {
  try {
    const response = await axiosClient.get("/iot/devices");
    return response.data;
  } catch (error) {
    console.error("Fetch Devices Error:", error.message);
    throw error;
  }
};
/**
 * 4. Điều khiển thiết bị (Mode, PWM, Timer)
 * Gửi partial data giúp tránh ghi đè dữ liệu không mong muốn
 */
export const updateDeviceSettings = async (deviceIndex, settings = {}) => {
  try {
    const response = await axiosClient.post("/iot/control-device", {
      device_index: deviceIndex,
      ...settings,
    });
    return response.data;
  } catch (error) {
    console.error("Update Device Settings Error:", error.message);
    throw error;
  }
};

/**
 * 5. Các hàm tiện ích (Helpers) để gọi từ UI cho nhanh
 */
export const changeDeviceMode = (deviceIndex, mode) =>
  updateDeviceSettings(deviceIndex, { mode });

export const changeDevicePWM = (deviceIndex, pwmValue) =>
  updateDeviceSettings(device_index, { manual_pwm: pwmValue });

export const updateDeviceTimer = (deviceIndex, start, end) =>
  updateDeviceSettings(deviceIndex, { start_hour: start, end_hour: end });

/**
 * 6. Lấy lịch sử thông báo
 */
export const fetchNotifications = async () => {
  try {
    const response = await axiosClient.get("/iot/notifications");
    return response.data;
  } catch (error) {
    console.error("Fetch Notifications Error:", error.message);
    throw error;
  }
};
export const markAllNotificationsAsReadApi = async () => {
  try {
    const response = await axiosClient.put("/iot/notifications/read-all");
    return response.data;
  } catch (error) {
    console.error("Mark All Notifications As Read Error:", error.message);
    throw error;
  }
};
