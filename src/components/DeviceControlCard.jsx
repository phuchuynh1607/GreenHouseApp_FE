import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const DeviceControlCard = ({
  device,
  template,
  onControl,
  onPWMChange,
  onTurnOff,
  onTurnOnManual,
  onTurnOnAuto,
}) => {
  const [showAutoDialog, setShowAutoDialog] = useState(false);
  const [tempStartHour, setTempStartHour] = useState(
    device.start_hour !== null && device.start_hour !== -1
      ? device.start_hour.toString()
      : "18",
  );

  const [tempEndHour, setTempEndHour] = useState(
    device.end_hour !== null && device.end_hour !== -1
      ? device.end_hour.toString()
      : "22",
  );

  const getModeLabel = (mode) => {
    if (mode === 0) return "Tắt";
    if (mode === 1) return "Tự động";
    return "Thủ công";
  };

  const handleModeChange = (mode) => {
    console.log("🎮 Mode change:", { mode, deviceIndex: device.device_index });

    if (mode === 1) {
      // AUTO mode - hiển thị dialog
      setTempStartHour(
        device.start_hour !== null && device.start_hour !== -1
          ? device.start_hour.toString()
          : "18",
      );
      setTempEndHour(
        device.end_hour !== null && device.end_hour !== -1
          ? device.end_hour.toString()
          : "22",
      );
      setShowAutoDialog(true);
    } else if (mode === 0) {
      // OFF mode - dùng turnOff
      console.log("🔴 Turning off device");
      onTurnOff(device.device_index);
    } else if (mode === 2) {
      // MANUAL mode - dùng turnOnManual
      console.log("🟢 Turning on device in manual mode");
      onTurnOnManual(device.device_index, device.manual_pwm || 128);
    }
  };

  const handleConfirmAuto = () => {
    const startHour = parseInt(tempStartHour);
    const endHour = parseInt(tempEndHour);

    // Validation
    if (isNaN(startHour) || isNaN(endHour)) {
      Alert.alert("Lỗi", "Vui lòng nhập giờ hợp lệ (0-23)");
      return;
    }

    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
      Alert.alert("Lỗi", "Giờ phải trong khoảng 0-23");
      return;
    }

    if (startHour === endHour) {
      Alert.alert("Lỗi", "Giờ bắt đầu và kết thúc không thể giống nhau");
      return;
    }

    setShowAutoDialog(false);
    onTurnOnAuto(
      device.device_index,
      startHour,
      endHour,
      device.manual_pwm || 128,
    );
  };

  const handleUpdateTimer = () => {
    const startHour = parseInt(tempStartHour);
    const endHour = parseInt(tempEndHour);

    if (isNaN(startHour) || isNaN(endHour)) return;
    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) return;

    // Dùng onControl cho update timer (vẫn giữ nguyên mode hiện tại)
    onControl(device.device_index, device.mode, startHour, endHour);
  };

  return (
    <>
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
                backgroundColor: device.mode === 0 ? "#bdc3c7" : "#2ecc71",
              },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {device.mode === 0
                ? "OFF"
                : device.mode === 2 && device.manual_pwm === 0
                  ? "OFF"
                  : "ON"}
            </Text>
          </View>
        </View>

        {/* Selector Chế độ */}
        <View style={styles.modeSelector}>
          {[
            { mode: 0, label: "Tắt" },
            { mode: 1, label: "Auto" },
            { mode: 2, label: "Bật" },
          ].map((item) => (
            <TouchableOpacity
              key={item.mode}
              onPress={() => handleModeChange(item.mode)}
              style={[
                styles.modeBtn,
                device.mode === item.mode && styles.activeModeBtn,
              ]}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  device.mode === item.mode && styles.activeModeBtnText,
                ]}
              >
                {item.label}
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
                onPWMChange(device.device_index, Math.round(val))
              }
            />

            <View style={styles.timeArea}>
              <Text style={styles.smallLabel}>Khung giờ hoạt động:</Text>
              <View style={styles.timeInputRow}>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  value={tempStartHour}
                  onChangeText={setTempStartHour}
                  onBlur={handleUpdateTimer}
                  placeholder="0"
                />
                <Text style={{ marginHorizontal: 10 }}>đến</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  value={tempEndHour}
                  onChangeText={setTempEndHour}
                  onBlur={handleUpdateTimer}
                  placeholder="23"
                />
                <Text style={styles.unitText}>giờ</Text>
              </View>
              {device.mode === 1 && (
                <Text style={styles.autoHint}>
                  * Auto mode: chỉ hoạt động trong khung giờ này
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Dialog xác nhận AUTO mode */}
      <Modal
        visible={showAutoDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAutoDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color="#429257"
              />
              <Text style={styles.modalTitle}>Bật chế độ Tự động</Text>
            </View>

            <Text style={styles.modalDesc}>
              Vui lòng thiết lập khung giờ hoạt động cho thiết bị
            </Text>

            <View style={styles.modalTimeRow}>
              <View style={styles.modalTimeInputWrap}>
                <Text style={styles.modalLabel}>Từ giờ</Text>
                <TextInput
                  style={styles.modalTimeInput}
                  keyboardType="numeric"
                  value={tempStartHour}
                  onChangeText={setTempStartHour}
                  placeholder="18"
                />
                <Text style={styles.modalUnit}>giờ</Text>
              </View>
              <Text style={styles.modalTo}>→</Text>
              <View style={styles.modalTimeInputWrap}>
                <Text style={styles.modalLabel}>Đến giờ</Text>
                <TextInput
                  style={styles.modalTimeInput}
                  keyboardType="numeric"
                  value={tempEndHour}
                  onChangeText={setTempEndHour}
                  placeholder="22"
                />
                <Text style={styles.modalUnit}>giờ</Text>
              </View>
            </View>

            <View style={styles.modalNote}>
              <MaterialCommunityIcons
                name="information"
                size={16}
                color="#888"
              />
              <Text style={styles.modalNoteText}>
                {tempStartHour <= tempEndHour
                  ? `Hoạt động từ ${tempStartHour}:00 đến ${tempEndHour}:00`
                  : `Hoạt động từ ${tempStartHour}:00 đến ${tempEndHour}:00 hôm sau`}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowAutoDialog(false)}
              >
                <Text style={styles.modalBtnCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleConfirmAuto}
              >
                <Text style={styles.modalBtnConfirmText}>Bật Auto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  autoHint: {
    fontSize: 10,
    color: "#429257",
    marginTop: 5,
    fontStyle: "italic",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    width: "85%",
    maxWidth: 340,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTimeInputWrap: {
    flex: 1,
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  modalTimeInput: {
    backgroundColor: "#f1f2f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  modalUnit: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  modalTo: {
    fontSize: 20,
    color: "#429257",
    marginHorizontal: 12,
  },
  modalNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalNoteText: {
    fontSize: 12,
    color: "#429257",
    marginLeft: 8,
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnCancel: {
    backgroundColor: "#f1f2f6",
  },
  modalBtnCancelText: {
    color: "#666",
    fontWeight: "600",
  },
  modalBtnConfirm: {
    backgroundColor: "#429257",
  },
  modalBtnConfirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default DeviceControlCard;
