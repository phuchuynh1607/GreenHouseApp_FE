import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ThresholdCard = ({
  title,
  type,
  icon,
  color,
  unit,
  value,
  onChange,
  onSave,
  onReset,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Ngưỡng dưới ({unit})</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={value.min}
            onChangeText={(txt) => onChange(type, "min", txt)}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Ngưỡng trên ({unit})</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={value.max}
            onChangeText={(txt) => onChange(type, "max", txt)}
          />
        </View>
      </View>

      <View style={styles.cardActions}>
        {onReset ? (
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => onReset(type)}
          >
            <Text style={styles.resetBtnText}>Đặt lại mặc định</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: color }]}
          onPress={() => onSave(type)}
        >
          <Text style={styles.saveBtnText}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
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

export default ThresholdCard;
