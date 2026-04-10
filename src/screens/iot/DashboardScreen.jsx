import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIoT } from "../../hooks/useIoT";
import DeviceControlCard from "../../components/DeviceControlCard";

const DashboardScreen = ({ navigation }) => {
  const { sensors, devices, loading, deviceHelpers } = useIoT(); // ← dùng deviceHelpers
  const insets = useSafeAreaInsets();

  // Template cố định cho UI
  const deviceTemplates = useMemo(
    () => [
      { name: "Hệ thống Đèn", device_index: 0, icon: "lightbulb-outline" },
      { name: "Quạt thông gió", device_index: 1, icon: "fan" },
      { name: "Máy bơm nước", device_index: 2, icon: "water-pump" },
    ],
    [],
  );

  const displayDevices = useMemo(() => {
    return deviceTemplates.map((tpl) => {
      const serverData = devices.find(
        (d) => d.device_index === tpl.device_index,
      );
      return (
        serverData || {
          ...tpl,
          mode: 0,
          manual_pwm: 128,
          start_hour: -1,
          end_hour: -1,
          current_value: 0,
        }
      );
    });
  }, [devices, deviceTemplates]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header]}>
        <View style={styles.headerSide} />

        <View style={styles.centerTitle}>
          <Text style={styles.statusText}>
            {loading ? "Loading..." : "GreenHouse App"}
          </Text>
        </View>
        <View style={styles.headerSide}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ThresholdSettings")}
            style={styles.headerBtn}
          >
            <Ionicons name="options-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Thông số thực tế</Text>
        <View style={styles.sensorGrid}>
          <SensorCard
            title="Nhiệt độ"
            value={sensors?.temp}
            unit="°C"
            icon="thermometer"
            color="#FF6B6B"
            onPress={() =>
              navigation.navigate("SensorHistory", { type: "temp" })
            }
          />
          <SensorCard
            title="Ánh sáng"
            value={sensors?.light}
            unit="%"
            icon="brightness-6"
            color="#FFD93D"
            onPress={() =>
              navigation.navigate("SensorHistory", { type: "light" })
            }
          />
          <SensorCard
            title="Ẩm đất"
            value={sensors?.soil}
            unit="%"
            icon="water-percent"
            color="#4D96FF"
            onPress={() =>
              navigation.navigate("SensorHistory", { type: "soil" })
            }
          />
          <SensorCard
            title="Ẩm khí"
            value={sensors?.humi}
            unit="%"
            icon="cloud-outline"
            color="#6BCB77"
            onPress={() =>
              navigation.navigate("SensorHistory", { type: "humi" })
            }
          />
        </View>

        <Text style={styles.sectionTitle}>Thiết bị hệ thống</Text>
        {displayDevices.map((device) => (
          <DeviceControlCard
            key={device.device_index}
            device={device}
            template={deviceTemplates[device.device_index]}
            onControl={deviceHelpers.changeMode}
            onPWMChange={deviceHelpers.changePWM}
            onTurnOff={deviceHelpers.turnOff}
            onTurnOnManual={deviceHelpers.turnOnManual}
            onTurnOnAuto={deviceHelpers.turnOnAuto}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const SensorCard = ({ title, value, unit, icon, color, onPress }) => (
  <TouchableOpacity style={styles.sensorCard} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.sensorTitle}>{title}</Text>
      <Text style={styles.sensorValue}>
        {value !== undefined && value !== null ? `${value}${unit}` : "--"}
      </Text>
    </View>
    {/* Thêm icon mũi tên nhỏ để người dùng biết là bấm vào được */}
    <Ionicons
      name="chevron-forward"
      size={16}
      color="#ccc"
      style={styles.arrow}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 45,
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#429257",
  },
  headerSide: {
    width: 45,
    alignItems: "center",
  },
  centerTitle: {
    flex: 1,
    alignItems: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerBtn: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
  },
  scrollContent: { padding: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 10,
    color: "#2c3e50",
  },
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sensorCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  iconContainer: { padding: 8, borderRadius: 12, marginRight: 10 },
  sensorTitle: { fontSize: 12, color: "#888" },
  sensorValue: { fontSize: 18, fontWeight: "bold", color: "#333" },
  arrow: { position: "absolute", right: 8, bottom: 15 },
});

export default DashboardScreen;
