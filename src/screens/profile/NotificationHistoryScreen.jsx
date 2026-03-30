import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import moment from "moment";
import { useIoT } from "../../hooks/useIoT";

const NotificationHistoryScreen = ({ navigation }) => {
  // Sử dụng hook useIoT để lấy dữ liệu từ Provider
  const { notifications, loading, refreshNotificationData } = useIoT();

  const sensorConfigs = {
    temp: {
      label: "Nhiệt độ",
      icon: "thermometer-outline",
      color: "#EF4444",
      bg: "#FEE2E2",
    },
    soil: {
      label: "Độ ẩm đất",
      icon: "leaf-outline",
      color: "#10B981",
      bg: "#D1FAE5",
    },
    light: {
      label: "Ánh sáng",
      icon: "sunny-outline",
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
  };

  const renderItem = ({ item }) => {
    const config = sensorConfigs[item.sensor_type] || {
      label: item.sensor_type,
      icon: "alert-circle-outline",
      color: "#6B7280",
      bg: "#F3F4F6",
    };

    return (
      <View style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={24} color={config.color} />
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title}>Cảnh báo {config.label}</Text>
            <Text style={styles.time}>
              {moment(item.created_at).format("HH:mm - DD/MM")}
            </Text>
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {item.message ||
              `Giá trị: ${item.current_value}. Vượt ngưỡng ${item.threshold_value}.`}
          </Text>
        </View>
      </View>
    );
  };
  useEffect(() => {
    refreshNotificationData();
  }, [refreshNotificationData]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lịch sử cảnh báo</Text>

        <TouchableOpacity onPress={refreshNotificationData}>
          <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Hiển thị Loading khi lần đầu vào trang mà chưa có data */}
      {loading && notifications.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#429257" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={refreshNotificationData} // Kéo để cập nhật
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={60}
                color="#D1D5DB"
              />
              <Text style={styles.emptyText}>Chưa có cảnh báo nào.</Text>
            </View>
          }
        />
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
  listContent: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  time: { fontSize: 11, color: "#6B7280" },
  message: { fontSize: 13, color: "#4B5563", lineHeight: 18 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { textAlign: "center", marginTop: 15, color: "#9CA3AF" },
});

export default NotificationHistoryScreen;
