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
      title: "Temp Threshold",
      icon: "thermometer-outline",
      color: "#EF4444",
      unit: "°C",
    },
    {
      type: "soil",
      title: "Soil Threshold",
      icon: "leaf-outline",
      color: "#10B981",
      unit: "%",
    },
    {
      type: "light",
      title: "Light Threshold",
      icon: "sunny-outline",
      color: "#F59E0B",
      unit: "%",
    },
  ];

  const { adminDefaults, updateAdminDefault, loading, refreshAdminDefaults } =
    useThreshold();

  const [localThresholds, setLocalThresholds] = useState({
    temp: { min: "10", max: "35" },
    soil: { min: "40", max: "80" },
    light: { min: "5", max: "80" },
  });

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
    const labels = {
      temp: "Temperature",
      soil: "Soil moisture",
      light: "Light",
    };

    const minValue = parseFloat(data.min);
    const maxValue = parseFloat(data.max);

    if (isNaN(minValue) || isNaN(maxValue)) {
      Alert.alert("Error", "Invalid input");
      return;
    }

    if (minValue >= maxValue) {
      Alert.alert("Error", "Min value must be smaller than max");
      return;
    }

    try {
      await updateThreshold(type, minValue, maxValue);
      Alert.alert("Succesfully!", `Updated threshold for ${labels[type]}`);
    } catch (error) {
      Alert.alert("Error", "Update threshold failed");
    }
  };

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
        <Text style={styles.headerTitle}>System Setting</Text>
        <TouchableOpacity onPress={handleRefreshData}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>
            Set Defaults Threshold for System. If users don't have a custom
            threshold for their sensor, they will use default thresholds.
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
              P/s: You must decide right thresholds for your system!
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
