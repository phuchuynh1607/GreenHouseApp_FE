import React, { useState, useEffect } from "react";
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

  const [tempStartHour, setTempStartHour] = useState("-1");
  const [tempEndHour, setTempEndHour] = useState("-1");

  useEffect(() => {
    const startVal =
      device.start_hour !== null && device.start_hour !== undefined
        ? device.start_hour.toString()
        : "-1";
    const endVal =
      device.end_hour !== null && device.end_hour !== undefined
        ? device.end_hour.toString()
        : "-1";

    setTempStartHour(startVal);
    setTempEndHour(endVal);
  }, [device.start_hour, device.end_hour]);

  const getModeLabel = (mode) => {
    if (mode === 0) return "Tắt";
    if (mode === 1) return "Tự động";
    return "Thủ công";
  };

  const handleModeChange = (mode) => {
    console.log(" Mode change:", { mode, deviceIndex: device.device_index });

    if (mode === 1) {
      // AUTO mode
      setTempStartHour(
        device.start_hour !== null && device.start_hour !== -1
          ? device.start_hour.toString()
          : "-1",
      );
      setTempEndHour(
        device.end_hour !== null && device.end_hour !== -1
          ? device.end_hour.toString()
          : "-1",
      );
      setShowAutoDialog(true);
    } else if (mode === 0) {
      // OFF mode
      console.log(" Turning off device");
      onTurnOff(device.device_index);
    } else if (mode === 2) {
      // MANUAL mode
      console.log(" Turning on device in manual mode");
      onTurnOnManual(device.device_index, device.manual_pwm || 128);
    }
  };

  const handleConfirmAuto = () => {
    const startHour = parseInt(tempStartHour);
    const endHour = parseInt(tempEndHour);

    // Kiểm tra nếu là trường hợp đặc biệt chạy 24/24
    const isAllDay = startHour === -1 && endHour === -1;

    if (isNaN(startHour) || isNaN(endHour)) {
      Alert.alert("Lỗi", "Vui lòng nhập giờ hợp lệ (-1 hoặc 0-23)");
      return;
    }

    // Nếu không phải chạy 24/24 thì mới kiểm tra logic giờ bình thường
    if (!isAllDay) {
      if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
        Alert.alert("Lỗi", "Giờ phải trong khoảng 0-23 (hoặc cả hai là -1)");
        return;
      }
      if (startHour === endHour) {
        Alert.alert("Lỗi", "Giờ bắt đầu và kết thúc không thể giống nhau");
        return;
      }
    }

    setShowAutoDialog(false);

    onTurnOnAuto(
      device.device_index,
      startHour,
      endHour,
      device.manual_pwm || 128,
    );
  };

  const handleUpdateTimerBlur = () => {
    const start = parseInt(tempStartHour);
    const end = parseInt(tempEndHour);

    if (isNaN(start) || isNaN(end)) return;

    // Kiểm tra logic giờ
    const isAllDay = start === -1 && end === -1;
    if (!isAllDay) {
      if (start < 0 || start > 23 || end < 0 || end > 23) return;
      if (start === end) return;
    }

    if (start === device.start_hour && end === device.end_hour) return;

    onControl(device.device_index, device.mode, start, end);
  };

  return (
    <View style={styles.deviceCard}>
      {/* Header: Icon + Name + Badge */}
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
            { backgroundColor: device.mode === 0 ? "#bdc3c7" : "#2ecc71" },
          ]}
        >
          <Text style={styles.statusBadgeText}>
            {device.mode === 0 || device.manual_pwm === 0 ? "OFF" : "ON"}
          </Text>
        </View>
      </View>

      {/* Mode Selector */}
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

      {/* Control Area: Slider & Timer Inputs */}
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
                onBlur={handleUpdateTimerBlur}
                placeholder="-1"
              />
              <Text style={{ marginHorizontal: 10 }}>đến</Text>
              <TextInput
                style={styles.timeInput}
                keyboardType="numeric"
                value={tempEndHour}
                onChangeText={setTempEndHour}
                onBlur={handleUpdateTimerBlur}
                placeholder="-1"
              />
              <Text style={styles.unitText}>giờ</Text>
            </View>
            {device.mode === 1 && (
              <>
                <Text style={styles.autoHint}>
                  * Auto mode: chỉ hoạt động trong khung giờ này
                </Text>
                <Text style={styles.allDayHint}>
                  * Nhập -1 và -1 để thiết bị chạy 24/24
                </Text>
              </>
            )}
          </View>
        </View>
      )}

      {/* Modal xác nhận AUTO */}
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
                color="#2f6b3f"
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
                  placeholder="-1"
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
                  placeholder="-1"
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
                {(() => {
                  const start = parseInt(tempStartHour);
                  const end = parseInt(tempEndHour);
                  if (start === -1 && end === -1) {
                    return "Chế độ Auto: Thiết bị sẽ chạy liên tục 24/24";
                  }
                  if (isNaN(start) || isNaN(end)) {
                    return "Vui lòng nhập giờ hợp lệ (-1 hoặc 0-23)";
                  }
                  if (start >= 0 && start <= 23 && end >= 0 && end <= 23) {
                    if (start === end)
                      return "Giờ bắt đầu và kết thúc không được trùng nhau";
                    return start < end
                      ? `Hoạt động từ ${start}:00 đến ${end}:00`
                      : `Hoạt động từ ${start}:00 đến ${end}:00 hôm sau`;
                  }
                  return "Lưu ý: Chỉ nhập -1 cho cả hai hoặc số từ 0-23";
                })()}
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
  autoHint: {
    fontSize: 10,
    color: "#2f6b3f",
    marginTop: 5,
    fontStyle: "italic",
  },
  allDayHint: {
    fontSize: 10,
    color: "#7f8c8d",
    marginTop: 2,
    fontStyle: "italic",
  },
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
  modalTimeInputWrap: { flex: 1, alignItems: "center" },
  modalLabel: { fontSize: 12, color: "#888", marginBottom: 8 },
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
  modalUnit: { fontSize: 12, color: "#888", marginTop: 4 },
  modalTo: { fontSize: 20, color: "#2f6b3f", marginHorizontal: 12 },
  modalNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalNoteText: { fontSize: 12, color: "#2f6b3f", marginLeft: 8, flex: 1 },
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
  modalBtnCancel: { backgroundColor: "#f1f2f6" },
  modalBtnCancelText: { color: "#666", fontWeight: "600" },
  modalBtnConfirm: { backgroundColor: "#2f6b3f" },
  modalBtnConfirmText: { color: "#fff", fontWeight: "600" },
});

export default DeviceControlCard;
