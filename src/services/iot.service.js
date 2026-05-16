import axiosClient from "./apiClient";

//get sensor data
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
 * get sensorlog -> chart
 * @param {number} hours
 * @param {number} max_points
 */
export const fetchSensorHistory = async (hours = 24, max_points = 50) => {
  try {
    const response = await axiosClient.get("/iot/sensor-history", {
      params: { hours, max_points },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch Sensor History Error:", error.message);
    throw error;
  }
};

//get all device
export const fetchAllDevices = async () => {
  try {
    const response = await axiosClient.get("/iot/devices");
    return response.data;
  } catch (error) {
    console.error("Fetch Devices Error:", error.message);
    throw error;
  }
};
//control device
export const updateDeviceSettings = async (deviceIndex, settings = {}) => {
  try {
    const payload = {
      device_index: Number(deviceIndex),
    };

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
    console.error(" Full error:", error);
    console.error(" Response data:", error.response?.data);
    console.error(" Response status:", error.response?.status);
    const errorMsg = error.response?.data?.detail || error.message;
    throw new Error(errorMsg);
  }
};

//change mode
export const changeDeviceMode = (
  deviceIndex,
  mode,
  start_hour = null,
  end_hour = null,
) => {
  const payload = { mode };
  //timer required when change-> mode auto
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
// OFF (mode 0)
export const turnOffDevice = (deviceIndex) =>
  updateDeviceSettings(deviceIndex, { mode: 0 });

// MANUAL(mode 2) with manual pwm
export const turnOnManual = (deviceIndex, pwmValue = 128) =>
  updateDeviceSettings(deviceIndex, { mode: 2, manual_pwm: pwmValue });

// AUTO (mode 1) with timer
export const turnOnAuto = (deviceIndex, start_hour, end_hour, pwmValue = 128) =>
  updateDeviceSettings(deviceIndex, {
    mode: 1,
    start_hour,
    end_hour,
    manual_pwm: pwmValue,
  });

// Notifications
export const fetchNotifications = async () => {
  try {
    const response = await axiosClient.get("/iot/notifications");
    return response.data;
  } catch (error) {
    console.error("Fetch Notifications Error:", error.message);
    throw error;
  }
};
// notification haven't been read?
export const markAllNotificationsAsReadApi = async () => {
  try {
    const response = await axiosClient.put("/iot/notifications/read-all");
    return response.data;
  } catch (error) {
    console.error("Mark All Notifications As Read Error:", error.message);
    throw error;
  }
};
