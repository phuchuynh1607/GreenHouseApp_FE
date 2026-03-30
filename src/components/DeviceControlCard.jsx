import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const DeviceControlCard = ({ device, template, onControl }) => {
  const getModeLabel = (mode) => {
    if (mode === 0) return "Tắt";
    if (mode === 1) return "Tự động";
    return "Thủ công";
  };

  return (
    <View style={styles.deviceCard}>
      <View style={styles.deviceHeader}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name={template.icon}
            size={28}
            color="#2c3e50"
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.deviceName}>{template.name}</Text>
            <Text style={styles.deviceSubText}>
              Chế độ:{" "}
              <Text style={styles.boldText}>{getModeLabel(device.mode)}</Text>
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: device.current_value > 0 ? "#2ecc71" : "#bdc3c7",
            },
          ]}
        >
          <Text style={styles.statusBadgeText}>
            {device.current_value > 0 ? "ON" : "OFF"}
          </Text>
        </View>
      </View>

      {/* Selector Chế độ */}
      <View style={styles.modeSelector}>
        {[0, 1, 2].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => onControl(device.device_index, { mode: m })}
            style={[styles.modeBtn, device.mode === m && styles.activeModeBtn]}
          >
            <Text
              style={[
                styles.modeBtnText,
                device.mode === m && styles.activeModeBtnText,
              ]}
            >
              {m === 0 ? "Tắt" : m === 1 ? "Auto" : "Bật"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Slider & Hẹn giờ (Chỉ hiện nếu không Tắt) */}
      {device.mode !== 0 && (
        <View style={styles.controlArea}>
          <Text style={styles.pwmText}>
            Công suất: {Math.round(device.manual_pwm / 2.55)}%
          </Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={255}
            step={5}
            value={device.manual_pwm}
            minimumTrackTintColor="#2ecc71"
            thumbTintColor="#2ecc71"
            onSlidingComplete={(val) =>
              onControl(device.device_index, { manual_pwm: Math.round(val) })
            }
          />

          <View style={styles.timeArea}>
            <Text style={styles.smallLabel}>Khung giờ hoạt động (0-23h):</Text>
            <View style={styles.timeInputRow}>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                defaultValue={String(device.start_hour ?? 0)}
                onBlur={(e) =>
                  onControl(device.device_index, {
                    start_hour: parseInt(e.nativeEvent.text) || 0,
                  })
                }
              />
              <Text style={{ marginHorizontal: 10 }}>đến</Text>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                defaultValue={String(device.end_hour ?? 23)}
                onBlur={(e) =>
                  onControl(device.device_index, {
                    end_hour: parseInt(e.nativeEvent.text) || 23,
                  })
                }
              />
              <Text style={styles.unitText}>giờ</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  deviceCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  row: { flexDirection: "row", alignItems: "center" },
  deviceName: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  deviceSubText: { fontSize: 13, color: "#7f8c8d" },
  boldText: { fontWeight: "bold", color: "#2ecc71" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: "#f1f2f6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeModeBtn: { backgroundColor: "#fff", elevation: 2 },
  modeBtnText: { fontSize: 13, color: "#7f8c8d" },
  activeModeBtnText: { color: "#2c3e50", fontWeight: "bold" },
  controlArea: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  pwmText: { fontSize: 12, color: "#95a5a6", marginBottom: 5 },
  timeArea: { marginTop: 10 },
  smallLabel: { fontSize: 12, color: "#7f8c8d", marginBottom: 5 },
  timeInputRow: { flexDirection: "row", alignItems: "center" },
  timeInput: {
    backgroundColor: "#f1f2f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    textAlign: "center",
  },
  unitText: { marginLeft: 8, color: "#7f8c8d", fontSize: 12 },
});

export default DeviceControlCard;
