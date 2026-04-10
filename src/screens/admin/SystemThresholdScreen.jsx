import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThreshold } from "../../hooks/useThreshold";
import ThresholdCard from "../../components/ThresholdCard";

const SystemThresholdScreen = ({ navigation }) => {
  const sensors = [
    {
      type: "temp",
      title: "Hệ thống: Nhiệt độ",
      icon: "thermometer-outline",
      color: "#EF4444",
      unit: "°C",
    },
    {
      type: "soil",
      title: "Hệ thống: Độ ẩm đất",
      icon: "leaf-outline",
      color: "#10B981",
      unit: "%",
    },
    {
      type: "light",
      title: "Hệ thống: Ánh sáng",
      icon: "sunny-outline",
      color: "#F59E0B",
      unit: "%",
    },
  ];

  const { adminDefaults, updateAdminDefault, loading, refreshAdminDefaults } =
    useThreshold();

  // State local quản lý việc nhập liệu
  const [localThresholds, setLocalThresholds] = useState({
    temp: { min: "0", max: "0" },
    soil: { min: "0", max: "0" },
    light: { min: "0", max: "0" },
  });

  // Map dữ liệu từ adminDefaults (BE) vào state local
  useEffect(() => {
    if (adminDefaults && adminDefaults.length > 0) {
      const newLocal = { ...localThresholds };
      adminDefaults.forEach((item) => {
        if (newLocal[item.sensor_type]) {
          newLocal[item.sensor_type] = {
            min: item.min_value?.toString() || "0",
            max: item.max_value?.toString() || "0",
          };
        }
      });
      setLocalThresholds(newLocal);
    }
  }, [adminDefaults]);

  const handleChange = (type, field, txt) => {
    // Chỉ cho phép nhập số và dấu chấm
    const validated = txt.replace(/[^0-9.]/g, "");
    setLocalThresholds((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: validated,
      },
    }));
  };

  const handleSave = async (type) => {
    const data = localThresholds[type];
    const minValue = parseFloat(data.min);
    const maxValue = parseFloat(data.max);

    if (isNaN(minValue) || isNaN(maxValue)) {
      Alert.alert("Lỗi", "Vui lòng nhập con số hợp lệ.");
      return;
    }

    if (minValue >= maxValue) {
      Alert.alert("Lỗi", "Ngưỡng dưới phải nhỏ hơn ngưỡng trên.");
      return;
    }

    try {
      await updateAdminDefault(type, minValue, maxValue);
      Alert.alert(
        "Thành công",
        `Đã cập nhật ngưỡng hệ thống cho ${type.toUpperCase()}`,
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật cấu hình hệ thống.");
    }
  };

  // Vì đây là Admin, "Reset" có nghĩa là tải lại dữ liệu từ Server để xóa các thay đổi chưa lưu
  const handleRefreshData = () => {
    refreshAdminDefaults();
  };

  return (
    <View style={styles.container}>
      {/* Header phong cách Admin */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cấu hình hệ thống</Text>
        <TouchableOpacity onPress={handleRefreshData}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>
            Thiết lập giá trị mặc định cho toàn bộ hệ thống. Các thay đổi này sẽ
            áp dụng trực tiếp cho những người dùng sử dụng cấu hình mặc định.
          </Text>

          {sensors.map((sensor) => (
            <ThresholdCard
              key={sensor.type}
              {...sensor}
              value={localThresholds[sensor.type]}
              onChange={handleChange}
              onSave={handleSave}
            />
          ))}

          <View style={styles.infoBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#6B7280"
            />
            <Text style={styles.infoText}>
              Lưu ý: Bạn đang chỉnh sửa dữ liệu ở cấp độ cao nhất. Hãy kiểm tra
              kỹ các thông số trước khi cập nhật.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2f6b3f" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 45,
    padding: 30,
    backgroundColor: "#429257",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  scrollContent: { padding: 20 },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 25,
  },
  infoBox: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: "#4B5563", marginLeft: 10 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default SystemThresholdScreen;
