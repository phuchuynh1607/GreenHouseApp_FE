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
 * @param {number} max_points - Số điểm tối đa muốn hiển thị trên Chart
 */
export const fetchSensorHistory = async (hours = 24, max_points = 50) => {
  try {
    const response = await axiosClient.get("/iot/sensor-history", {
      params: { hours, max_points }, // Gửi query param ?hours=24
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
    // Tạo payload sạch
    const payload = {
      device_index: Number(deviceIndex),
    };

    // Chỉ thêm vào payload nếu giá trị khác null/undefined
    if (settings.mode !== undefined && settings.mode !== null)
      payload.mode = Number(settings.mode);
    if (settings.manual_pwm !== undefined && settings.manual_pwm !== null)
      payload.manual_pwm = Number(settings.manual_pwm);
    if (settings.start_hour !== undefined && settings.start_hour !== null)
      payload.start_hour = Number(settings.start_hour);
    if (settings.end_hour !== undefined && settings.end_hour !== null)
      payload.end_hour = Number(settings.end_hour);

    const response = await axiosClient.post("/iot/control-device", payload);
    return response.data;
  } catch (error) {
    console.error("❌ Full error:", error);
    console.error("❌ Response data:", error.response?.data);
    console.error("❌ Response status:", error.response?.status);
    const errorMsg = error.response?.data?.detail || error.message;
    throw new Error(errorMsg);
  }
};

// Chuyển Mode: Lưu ý BE yêu cầu AUTO phải có Timer
export const changeDeviceMode = (
  deviceIndex,
  mode,
  start_hour = null,
  end_hour = null,
) => {
  const payload = { mode };
  // Nếu chuyển sang AUTO mode, bắt buộc phải có timer
  if (mode === 1) {
    if (start_hour === null || end_hour === null) {
      console.error("AUTO mode requires start_hour and end_hour");
      throw new Error("AUTO mode requires timer settings");
    }
    payload.start_hour = start_hour;
    payload.end_hour = end_hour;
  }
  if (start_hour !== null && end_hour !== null) {
    payload.start_hour = start_hour;
    payload.end_hour = end_hour;
  }
  return updateDeviceSettings(deviceIndex, payload);
};

export const changeDevicePWM = (deviceIndex, pwmValue) =>
  updateDeviceSettings(deviceIndex, { manual_pwm: pwmValue });

export const updateDeviceTimer = (deviceIndex, start, end) =>
  updateDeviceSettings(deviceIndex, { start_hour: start, end_hour: end });
// Tắt thiết bị (mode 0)
export const turnOffDevice = (deviceIndex) =>
  updateDeviceSettings(deviceIndex, { mode: 0 });

// Bật manual (mode 2) với PWM tùy chọn
export const turnOnManual = (deviceIndex, pwmValue = 128) =>
  updateDeviceSettings(deviceIndex, { mode: 2, manual_pwm: pwmValue });

// Bật auto (mode 1) với timer bắt buộc
export const turnOnAuto = (deviceIndex, start_hour, end_hour, pwmValue = 128) =>
  updateDeviceSettings(deviceIndex, {
    mode: 1,
    start_hour,
    end_hour,
    manual_pwm: pwmValue,
  });
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
