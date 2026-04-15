import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThreshold } from "../../hooks/useThreshold";
import ThresholdCard from "../../components/ThresholdCard";

const ThresholdSettingScreen = ({ navigation }) => {
  const sensors = [
    {
      type: "temp",
      title: "Cảnh báo Nhiệt độ",
      icon: "thermometer-outline",
      color: "#EF4444",
      unit: "°C",
    },
    {
      type: "soil",
      title: "Cảnh báo Độ ẩm đất",
      icon: "leaf-outline",
      color: "#10B981",
      unit: "%",
    },
    {
      type: "light",
      title: "Cảnh báo Ánh sáng",
      icon: "sunny-outline",
      color: "#F59E0B",
      unit: "%",
    },
  ];

  const { activeThresholds, updateThreshold, resetThreshold, loading } =
    useThreshold();

  // State local để quản lý việc nhập liệu trước khi nhấn Lưu
  const [localThresholds, setLocalThresholds] = useState({
    temp: { min: "10", max: "35" },
    soil: { min: "40", max: "80" },
    light: { min: "5", max: "80" },
  });

  useEffect(() => {
    // 2. Map dữ liệu từ BE (sensor_type: temp, soil, light) vào State local
    if (activeThresholds && activeThresholds.length > 0) {
      const tempData = activeThresholds.find((t) => t.sensor_type === "temp");
      const soilData = activeThresholds.find((t) => t.sensor_type === "soil");
      const lightData = activeThresholds.find((t) => t.sensor_type === "light");

      setLocalThresholds({
        temp: {
          min: tempData?.min_value?.toString() || "10",
          max: tempData?.max_value?.toString() || "35",
        },
        soil: {
          min: soilData?.min_value?.toString() || "5",
          max: soilData?.max_value?.toString() || "80",
        },
        light: {
          min: lightData?.min_value?.toString() || "5",
          max: lightData?.max_value?.toString() || "80",
        },
      });
    }
  }, [activeThresholds]);

  const handleSave = async (type) => {
    const data = localThresholds[type];
    const labels = { temp: "Nhiệt độ", soil: "Độ ẩm đất", light: "Ánh sáng" };

    // Chuyển đổi sang số khi nhấn Lưu
    const minValue = parseFloat(data.min);
    const maxValue = parseFloat(data.max);

    // Validate nhanh
    if (isNaN(minValue) || isNaN(maxValue)) {
      Alert.alert("Lỗi", "Vui lòng nhập con số hợp lệ");
      return;
    }

    if (minValue >= maxValue) {
      Alert.alert("Lỗi", "Ngưỡng dưới phải nhỏ hơn ngưỡng trên");
      return;
    }

    try {
      await updateThreshold(type, minValue, maxValue);
      Alert.alert("Thành công", `Đã cập nhật ngưỡng cho ${labels[type]}`);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật ngưỡng.");
    }
  };
  const handleChange = (type, field, txt) => {
    const validated = txt.replace(/[^0-9.]/g, "");

    setLocalThresholds((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: validated,
      },
    }));
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt ngưỡng</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>
            Hệ thống sẽ gửi thông báo khi các thông số vượt ra khỏi khoảng an
            toàn mà bạn thiết lập.
          </Text>

          {/* 3. Hiển thị 3 Card tương ứng với BE */}
          {sensors.map((sensor) => (
            <ThresholdCard
              key={sensor.type}
              {...sensor}
              value={localThresholds[sensor.type]}
              onChange={handleChange}
              onSave={handleSave}
              onReset={resetThreshold}
            />
          ))}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#6B7280"
            />
            <Text style={styles.infoText}>
              Giá trị mặc định được thiết lập bởi Admin dựa trên tiêu chuẩn của
              hệ thống.
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
    padding: 30,
    paddingTop: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#2f6b3f",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  scrollContent: { padding: 20 },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconBox: { padding: 10, borderRadius: 12, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },

  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputWrap: { width: "47%" },
  inputLabel: { fontSize: 12, color: "#9CA3AF", marginBottom: 6 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 15,
  },
  resetBtn: { paddingVertical: 8 },
  resetBtnText: { color: "#9CA3AF", fontSize: 14 },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { color: "#fff", fontWeight: "bold" },

  infoBox: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
  },
  infoText: { flex: 1, fontSize: 13, color: "#6B7280", marginLeft: 10 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ThresholdSettingScreen;
