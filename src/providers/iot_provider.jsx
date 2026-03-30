import React, { useState, useEffect, useCallback, useRef } from "react";
import { IotContext } from "../context/IotContext";
import {
  fetchLatestSensorData,
  fetchAllDevices,
  updateDeviceSettings,
  fetchNotifications,
  fetchSensorHistory,
} from "../services/iot.service";
import { useAuth } from "../hooks/useAuth";

export const IotProvider = ({ children }) => {
  const [sensors, setSensors] = useState(null);
  const [devices, setDevices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Dùng useRef để chặn việc fetch đè dữ liệu khi đang kéo Slider
  const lastManualAction = useRef(0);
  const refreshFastDataRef = useRef();
  const refreshNotificationRef = useRef();
  // 1. Hàm lấy dữ liệu (Cảm biến + Thiết bị)
  const refreshFastData = useCallback(async () => {
    // CHẶN TẠI ĐÂY: Nếu không có user hoặc user là admin thì không làm gì cả
    if (!user || user.role === "admin") return;
    // Nếu vừa mới thao tác tay (trong vòng 3s), không fetch để tránh nhảy Slider/Switch
    if (Date.now() - lastManualAction.current < 3000) return;
    try {
      const [sensorData, devicesData] = await Promise.all([
        fetchLatestSensorData(),
        fetchAllDevices(),
      ]);
      setSensors(sensorData);
      setDevices(devicesData);
    } catch (err) {
      console.error("Lỗi fetch Fast IoT data:", err);
    }
  }, [user]);

  // 2. Hàm lấy THÔNG BÁO
  const refreshNotificationData = useCallback(async () => {
    if (!user) return;
    try {
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);
    } catch (err) {
      console.error("Lỗi fetch Notifications:", err);
    }
  }, [user]);

  /**
   * 3. Hàm điều khiển thiết bị (Cải tiến)
   * @param {number} deviceIndex - Index của thiết bị
   * @param {object} settings - Các trường cần cập nhật {mode, manual_pwm, ...}
   */
  const handleControlDevice = async (deviceIndex, settings) => {
    // Đánh dấu vừa thao tác tay
    lastManualAction.current = Date.now();

    try {
      // 1. Cập nhật UI ngay lập tức (Optimistic UI) để người dùng thấy mượt
      setDevices((prevDevices) =>
        prevDevices.map((d) =>
          d.device_index === deviceIndex ? { ...d, ...settings } : d,
        ),
      );

      // 2. Gửi lệnh xuống Backend
      await updateDeviceSettings(deviceIndex, settings);
    } catch (err) {
      console.error("Lỗi điều khiển thiết bị:", err);
      // Nếu lỗi thì fetch lại để rollback UI về trạng thái thực của server
      const devicesData = await fetchAllDevices();
      setDevices(devicesData);
      throw err;
    }
  };
  // Cập nhật Ref mỗi khi hàm thay đổi
  useEffect(() => {
    refreshFastDataRef.current = refreshFastData;
    refreshNotificationRef.current = refreshNotificationData;
  }, [refreshFastData, refreshNotificationData]);
  // 4. Polling
  useEffect(() => {
    if (user) {
      setLoading(true);

      // Khởi tạo các mảng promise để chạy lần đầu
      const initialTasks = [refreshNotificationData()];

      // Chỉ thêm fetch dữ liệu IoT nếu KHÔNG PHẢI admin
      if (user.role !== "admin") {
        initialTasks.push(refreshFastData());
      }

      Promise.all(initialTasks).finally(() => setLoading(false));

      // --- SETUP INTERVALS ---
      let fastInterval;
      // CHỈ tạo interval lấy dữ liệu cảm biến cho User thường
      if (user.role !== "admin") {
        fastInterval = setInterval(() => refreshFastDataRef.current(), 5000);
      }

      // Interval lấy Notification (Admin có thể giữ lại hoặc tăng thời gian lên 1 phút để siêu tiết kiệm)
      const slowInterval = setInterval(
        () => refreshNotificationRef.current(),
        user.role === "admin" ? 60000 : 20000, // Admin 1 phút check 1 lần, User 20s
      );

      return () => {
        if (fastInterval) clearInterval(fastInterval);
        clearInterval(slowInterval);
      };
    } else {
      // Reset data khi logout
      setSensors(null);
      setDevices([]);
      setNotifications([]);
      setHistory([]);
    }
  }, [user]);
  // 5. Hàm lấy lịch sử (Dùng khi vào màn hình Chart)
  const refreshHistory = useCallback(
    async (hours = 24) => {
      if (!user) return;
      try {
        const data = await fetchSensorHistory(hours);
        setHistory(data);
        return data;
      } catch (err) {
        console.error("Lỗi fetch History:", err);
      }
    },
    [user],
  );
  return (
    <IotContext.Provider
      value={{
        sensors,
        devices,
        notifications,
        history,
        loading,
        refreshIotData: refreshFastData,
        refreshHistory,
        refreshNotificationData,
        controlDevice: handleControlDevice,
      }}
    >
      {children}
    </IotContext.Provider>
  );
};
