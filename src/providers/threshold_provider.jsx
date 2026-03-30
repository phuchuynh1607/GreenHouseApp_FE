import React, { useState, useEffect, useCallback } from "react";
import { ThresholdContext } from "../context/ThresholdContext";
import {
  fetchActiveThresholdsApi,
  setUserThresholdApi,
  resetToDefaultApi,
  fetchAdminThresholdApi,
  setAdminThresholdApi,
} from "../services/threshold.service";
import { useAuth } from "../hooks/useAuth";

export const ThresholdProvider = ({ children }) => {
  const [activeThresholds, setActiveThresholds] = useState([]);
  const [adminDefaults, setAdminDefaults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Lấy danh sách ngưỡng (đã tính ưu tiên User > Admin)
  const getThresholds = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchActiveThresholdsApi();
      setActiveThresholds(data);
    } catch (err) {
      console.error("Lỗi fetch thresholds:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Hàm đặt ngưỡng mới
  const updateThreshold = async (sensorType, min, max) => {
    try {
      await setUserThresholdApi(sensorType, min, max);
      await getThresholds(); // Refresh lại sau khi update
    } catch (err) {
      console.error("Lỗi cập nhật ngưỡng:", err);
      throw err;
    }
  };

  // Hàm xóa ngưỡng cá nhân (Reset về mặc định)
  const resetThreshold = async (sensorType) => {
    try {
      await resetToDefaultApi(sensorType);
      await getThresholds(); // Refresh lại để lấy giá trị Admin
    } catch (err) {
      console.error("Lỗi reset ngưỡng:", err);
      throw err;
    }
  };

  // --- LOGIC CHO ADMIN (SYSTEM DEFAULTS) ---

  // Lấy ngưỡng mặc định hệ thống (chỉ gọi khi user là admin)
  const getAdminDefaults = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const data = await fetchAdminThresholdApi();
      setAdminDefaults(data);
    } catch (err) {
      console.error("Lỗi fetch admin defaults:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cập nhật ngưỡng mặc định hệ thống
  const updateAdminDefault = async (sensorType, min, max) => {
    try {
      await setAdminThresholdApi(sensorType, min, max);
      await getAdminDefaults(); // Cập nhật lại list admin
      // Lưu ý: Sau khi admin đổi default, active thresholds của user
      // (những người chưa set riêng) cũng sẽ thay đổi theo.
      await getThresholds();
    } catch (err) {
      console.error("Lỗi cập nhật ngưỡng hệ thống:", err);
      throw err;
    }
  };

  // Tự động load dữ liệu tùy theo vai trò
  useEffect(() => {
    getThresholds();
    if (user?.role === "admin") {
      getAdminDefaults();
    }
  }, [getThresholds, getAdminDefaults, user]);
  return (
    <ThresholdContext.Provider
      value={{
        // Data & Loading
        activeThresholds,
        adminDefaults, // Trả ra cho Admin Screen dùng
        loading,

        // User Actions
        updateThreshold,
        resetThreshold,
        refreshThresholds: getThresholds,

        // Admin Actions
        updateAdminDefault, // Trả ra cho Admin Screen dùng
        refreshAdminDefaults: getAdminDefaults,
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
