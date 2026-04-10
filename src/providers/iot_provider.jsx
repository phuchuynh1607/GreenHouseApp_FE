import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { IotContext } from "../context/IotContext";
import {
  fetchLatestSensorData,
  fetchAllDevices,
  updateDeviceSettings,
  fetchNotifications,
  fetchSensorHistory,
  markAllNotificationsAsReadApi,
  turnOffDevice,
  turnOnManual,
  turnOnAuto,
  changeDevicePWM,
  updateDeviceTimer,
} from "../services/iot.service";
import { useAuth } from "../hooks/useAuth";

export const IotProvider = ({ children }) => {
  const [sensors, setSensors] = useState(null);
  const [devices, setDevices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [isPolling, setIsPolling] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Refs
  const lastManualAction = useRef(0);
  const refreshFastDataRef = useRef();
  const refreshNotificationRef = useRef();
  const debounceTimer = useRef(null);
  const intervalsRef = useRef({ fast: null, notification: null });

  // 1. Hàm lấy dữ liệu (Cảm biến + Thiết bị)
  const refreshFastData = useCallback(async () => {
    // CHẶN TẠI ĐÂY: Nếu không có user hoặc user là admin thì không làm gì cả
    if (!user || user.role === "admin") return;
    if (!isPolling) return;

    if (Date.now() - lastManualAction.current < 3000) return;

    try {
      const [sensorData, devicesData] = await Promise.allSettled([
        fetchLatestSensorData(),
        fetchAllDevices(),
      ]);
      if (sensorData.status === "fulfilled") {
        setSensors(sensorData.value);
      } else {
        console.error("Fetch sensors failed:", sensorData.reason);
      }
      if (devicesData.status === "fulfilled") {
        setDevices(devicesData.value);
      } else {
        console.error("Fetch devices failed:", devicesData.reason);
      }
    } catch (err) {
      console.error("Lỗi fetch Fast IoT data:", err);
    }
  }, [user, isPolling]);

  // 2. Hàm lấy THÔNG BÁO
  const refreshNotificationData = useCallback(async () => {
    if (!user) return;
    try {
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);

      if (user.role === "admin") {
        const count = notificationsData.filter(
          (n) => n.is_read === false,
        ).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Lỗi fetch Notifications:", err);
    }
  }, [user]);

  // Hàm gọi API mark-all-as-read
  const handleMarkAsRead = async () => {
    try {
      await markAllNotificationsAsReadApi();
      setUnreadCount(0);
      await refreshNotificationData();
    } catch (err) {
      console.error("Không thể đánh dấu đã đọc:", err);
    }
  };
  /**
   * 3. Hàm điều khiển thiết bị (Cải tiến)
   * @param {number} deviceIndex - Index của thiết bị
   * @param {object} settings - Các trường cần cập nhật {mode, manual_pwm, ...}
   */
  const controlDevice = useCallback(
    async (deviceIndex, settings) => {
      // Validate dữ liệu trước khi gửi
      if (
        settings.mode === 1 &&
        (settings.start_hour === undefined || settings.end_hour === undefined)
      ) {
        const error = new Error("AUTO mode requires start_hour and end_hour");
        error.validationError = true;
        throw error;
      }

      if (
        settings.start_hour !== undefined &&
        settings.end_hour !== undefined
      ) {
        if (settings.start_hour === settings.end_hour) {
          const error = new Error("Start hour and end hour cannot be the same");
          error.validationError = true;
          throw error;
        }
        if (
          settings.start_hour < 0 ||
          settings.start_hour > 23 ||
          settings.end_hour < 0 ||
          settings.end_hour > 23
        ) {
          const error = new Error("Hours must be between 0 and 23");
          error.validationError = true;
          throw error;
        }
      }

      lastManualAction.current = Date.now();

      // Lưu lại state cũ để rollback nếu cần
      const oldDevices = [...devices];

      // 1. Optimistic UI update: Cập nhật ngay lập tức cho mượt
      setDevices((prev) =>
        prev.map((d) =>
          d.device_index === deviceIndex ? { ...d, ...settings } : d,
        ),
      );
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      // Trả về Promise để Screen có thể dùng await hiển thị Loading/Alert
      return new Promise((resolve, reject) => {
        debounceTimer.current = setTimeout(async () => {
          try {
            const response = await updateDeviceSettings(deviceIndex, settings);
            if (settings.mode !== undefined) {
              const freshDevices = await fetchAllDevices();
              setDevices(freshDevices);
            }

            resolve(response);
          } catch (err) {
            console.error("Lỗi điều khiển thiết bị:", err.message);

            // Rollback: Khôi phục state cũ
            setDevices(oldDevices);

            // Nên throw lỗi chi tiết hơn
            const error = new Error(
              err.response?.data?.detail ||
                err.message ||
                "Không thể điều khiển thiết bị",
            );
            error.statusCode = err.response?.status;
            reject(error);
          }
        }, 500);
      });
    },
    [devices, fetchAllDevices],
  );

  // Các hàm tiện ích (wrap handleControlDevice)
  const deviceHelpers = {
    changeMode: (deviceIndex, mode, start_hour = null, end_hour = null) =>
      controlDevice(deviceIndex, { mode, start_hour, end_hour }),

    changePWM: (deviceIndex, manual_pwm) =>
      controlDevice(deviceIndex, { manual_pwm }),

    updateTimer: (deviceIndex, start_hour, end_hour) =>
      controlDevice(deviceIndex, { start_hour, end_hour }),

    turnOff: (deviceIndex) => controlDevice(deviceIndex, { mode: 0 }),

    turnOnManual: (deviceIndex, manual_pwm = 128) =>
      controlDevice(deviceIndex, { mode: 2, manual_pwm }),

    turnOnAuto: (deviceIndex, start_hour, end_hour, manual_pwm = 128) =>
      controlDevice(deviceIndex, {
        mode: 1,
        start_hour,
        end_hour,
        manual_pwm,
      }),
  };

  // Cập nhật Ref mỗi khi hàm thay đổi
  useEffect(() => {
    refreshFastDataRef.current = refreshFastData;
    refreshNotificationRef.current = refreshNotificationData;
  }, [refreshFastData, refreshNotificationData]);

  // 4. Polling
  useEffect(() => {
    if (!user) {
      // Reset state khi logout
      setSensors(null);
      setDevices([]);
      setNotifications([]);
      setHistory([]);
      setUnreadCount(0);
      setIsPolling(true);
      return;
    }
    setLoading(true);
    // Khởi tạo data lần đầu
    const initData = async () => {
      try {
        await Promise.allSettled([
          refreshNotificationData(),
          user.role !== "admin" ? refreshFastData() : Promise.resolve(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    initData();
    // Setup intervals
    const intervals = [];
    // Interval cho sensors/devices (chỉ user thường, 5 giây)
    if (user.role !== "admin") {
      const fastInterval = setInterval(() => {
        refreshFastDataRef.current();
      }, 5000);
      intervals.push(fastInterval);
      intervalsRef.current.fast = fastInterval;
    }
    // Interval cho notifications (admin: 60s, user: 20s)
    const notificationInterval = setInterval(
      () => {
        refreshNotificationRef.current();
      },
      user.role === "admin" ? 60000 : 20000,
    );
    intervals.push(notificationInterval);
    intervalsRef.current.notification = notificationInterval;
    // Cleanup
    return () => {
      intervals.forEach((interval) => clearInterval(interval));
      intervalsRef.current = { fast: null, notification: null };
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [user, refreshFastData, refreshNotificationData]);

  // 5. Hàm lấy lịch sử (Dùng khi vào màn hình Chart)
  const refreshHistory = useCallback(
    async (hours = 24, max_points = 50) => {
      if (!user) return [];

      try {
        const data = await fetchSensorHistory(hours, max_points);
        setHistory(data);
        return data;
      } catch (err) {
        console.error("Lỗi fetch History:", err);
        return [];
      }
    },
    [user],
  );
  const contextValue = useMemo(
    () => ({
      sensors,
      devices,
      notifications,
      history,
      unreadCount,
      loading,
      isPolling,
      refreshIotData: refreshFastData,
      refreshHistory,
      refreshNotifications: refreshNotificationData,
      controlDevice,
      deviceHelpers,
      markAsRead: handleMarkAsRead,
    }),
    [
      sensors,
      devices,
      notifications,
      history,
      unreadCount,
      loading,
      isPolling,
      refreshFastData,
      refreshHistory,
      refreshNotificationData,
      controlDevice,
    ],
  );

  return (
    <IotContext.Provider value={contextValue}>{children}</IotContext.Provider>
  );
};
