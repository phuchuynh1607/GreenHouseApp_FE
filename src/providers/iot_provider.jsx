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

  const lastManualAction = useRef(0);
  const refreshFastDataRef = useRef();
  const refreshNotificationRef = useRef();
  const debounceTimer = useRef(null);
  const intervalsRef = useRef({ fast: null, notification: null });

  // 1. Hàm lấy dữ liệu (Cảm biến + Thiết bị)
  const refreshFastData = useCallback(async () => {
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
      const currentDevice = devices.find((d) => d.device_index === deviceIndex);
      if (!currentDevice) {
        console.error("Device not found:", deviceIndex);
        return Promise.reject(new Error("Device not found"));
      }
      let normalizedStartHour = -1;
      let normalizedEndHour = -1;

      if (settings.start_hour !== undefined) {
        normalizedStartHour = settings.start_hour;
      } else {
        normalizedStartHour = currentDevice.start_hour ?? -1;
      }

      if (settings.end_hour !== undefined) {
        normalizedEndHour = settings.end_hour;
      } else {
        normalizedEndHour = currentDevice.end_hour ?? -1;
      }

      if (normalizedStartHour === null || normalizedStartHour === undefined)
        normalizedStartHour = -1;
      if (normalizedEndHour === null || normalizedEndHour === undefined)
        normalizedEndHour = -1;

      // 1. Kiểm tra logic cho chế độ AUTO (Mode 1)
      const targetMode =
        settings.mode !== undefined ? settings.mode : currentDevice.mode;

      if (targetMode === 1) {
        const isAllDay = normalizedStartHour === -1 && normalizedEndHour === -1;
        const isValidRange =
          normalizedStartHour >= 0 &&
          normalizedStartHour <= 23 &&
          normalizedEndHour >= 0 &&
          normalizedEndHour <= 23 &&
          normalizedStartHour !== normalizedEndHour;

        if (!isAllDay && !isValidRange) {
          const error = new Error(
            "Chế độ Tự động yêu cầu: Cả hai giờ là -1 (24/7) HOẶC khung giờ 0-23h hợp lệ (start != end)",
          );
          error.validationError = true;
          throw error;
        }

        console.log(" AUTO mode validated:", {
          isAllDay,
          isValidRange,
          start: normalizedStartHour,
          end: normalizedEndHour,
        });
      }

      // 2. Chặn trường hợp "lẻ" (-1 và một số khác -1) để khớp logic Backend
      if (
        (normalizedStartHour === -1 && normalizedEndHour !== -1) ||
        (normalizedStartHour !== -1 && normalizedEndHour === -1)
      ) {
        const error = new Error(
          "Hẹn giờ phải đặt cả hai là -1 (tắt hẹn giờ) hoặc cả hai trong khoảng 0-23h (bật hẹn giờ)",
        );
        error.validationError = true;
        throw error;
      }

      // 3. Validate dải giá trị PWM
      if (
        settings.manual_pwm !== undefined &&
        (settings.manual_pwm < 0 || settings.manual_pwm > 255)
      ) {
        const error = new Error("Giá trị PWM phải nằm trong khoảng 0-255");
        error.validationError = true;
        throw error;
      }

      // 4. ✅ THÊM: Xử lý đặc biệt khi chuyển mode
      // Nếu chuyển từ AUTO sang MANUAL, cần đảm bảo timer không còn ảnh hưởng
      if (
        targetMode === 2 &&
        currentDevice.mode === 1 &&
        settings.start_hour === undefined &&
        settings.end_hour === undefined
      ) {
        // Giữ nguyên timer cũ nhưng backend sẽ xử lý
        console.log(" Switching from AUTO to MANUAL, keeping existing timer:", {
          normalizedStartHour,
          normalizedEndHour,
        });
      }

      // ========== TẠO REQUEST BODY CUỐI CÙNG ==========
      const finalSettings = {
        ...settings,
        start_hour: normalizedStartHour,
        end_hour: normalizedEndHour,
      };

      // Log để debug
      console.log("📤 Control device request:", {
        deviceIndex,
        targetMode,
        originalSettings: settings,
        finalSettings,
      });

      // ========== THỰC THI (Optimistic Update) ==========
      lastManualAction.current = Date.now();
      const oldDevices = [...devices];

      // Optimistic update
      setDevices((prev) =>
        prev.map((d) =>
          d.device_index === deviceIndex
            ? {
                ...d,
                ...finalSettings,
                // Đảm bảo timer được cập nhật đúng
                start_hour: normalizedStartHour,
                end_hour: normalizedEndHour,
              }
            : d,
        ),
      );

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      return new Promise((resolve, reject) => {
        debounceTimer.current = setTimeout(async () => {
          try {
            const response = await updateDeviceSettings(
              deviceIndex,
              finalSettings,
            );

            // Đồng bộ lại dữ liệu chuẩn từ server
            const freshDevices = await fetchAllDevices();
            setDevices(freshDevices);

            console.log("✅ Control device success:", response);
            resolve(response);
          } catch (err) {
            console.error(
              "❌ Control device error:",
              err.response?.data || err.message,
            );
            setDevices(oldDevices); // Rollback nếu lỗi API

            const errorMessage =
              err.response?.data?.detail ||
              err.message ||
              "Lỗi điều khiển thiết bị";
            const error = new Error(errorMessage);
            error.statusCode = err.response?.status;
            reject(error);
          }
        }, 500);
      });
    },
    [devices],
  );

  const deviceHelpers = {
    // 1. Thay đổi Mode (tự động giữ timer cũ nếu không truyền timer mới)
    changeMode: (deviceIndex, mode, start_hour = null, end_hour = null) => {
      const settings = { mode };
      if (start_hour !== null && end_hour !== null) {
        settings.start_hour = start_hour;
        settings.end_hour = end_hour;
      }
      return controlDevice(deviceIndex, settings);
    },

    // 2. Chỉ cập nhật tốc độ PWM
    changePWM: (deviceIndex, manual_pwm) =>
      controlDevice(deviceIndex, { manual_pwm }),

    // 3. Cập nhật Hẹn giờ (gửi -1 để chạy 24/7 hoặc tắt hẹn giờ)
    updateTimer: (deviceIndex, start_hour, end_hour) => {
      // Sử dụng ?? để xử lý null/undefined
      const finalStart = start_hour ?? -1;
      const finalEnd = end_hour ?? -1;

      return controlDevice(deviceIndex, {
        start_hour: finalStart,
        end_hour: finalEnd,
      });
    },

    // 4. Tắt thiết bị nhanh
    turnOff: (deviceIndex) => controlDevice(deviceIndex, { mode: 0 }),

    // 5. Bật thủ công (Reset timer về -1 để tránh bị tắt theo lịch cũ)
    turnOnManual: (deviceIndex, manual_pwm = 128) => {
      return controlDevice(deviceIndex, {
        mode: 2,
        manual_pwm,
        start_hour: -1, // Reset timer
        end_hour: -1, // Reset timer
      });
    },

    // 6. Bật tự động (Mặc định -1,-1 để chạy 24/7 theo cảm biến)
    turnOnAuto: (
      deviceIndex,
      start_hour = -1,
      end_hour = -1,
      manual_pwm = 128,
    ) => {
      // Đảm bảo start_hour và end_hour không bị undefined
      const finalStart = start_hour ?? -1;
      const finalEnd = end_hour ?? -1;

      console.log("🎯 turnOnAuto called:", {
        deviceIndex,
        finalStart,
        finalEnd,
        manual_pwm,
      });

      return controlDevice(deviceIndex, {
        mode: 1,
        manual_pwm,
        start_hour: finalStart,
        end_hour: finalEnd,
      });
    },
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
      refreshNotificationData,
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
