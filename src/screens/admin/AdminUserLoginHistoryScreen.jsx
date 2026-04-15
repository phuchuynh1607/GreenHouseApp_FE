import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAdmin } from "../../hooks/useAdmin";
import dayjs from "dayjs";

const AdminUserLoginHistoryScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { selectedUserHistory, loading, getUserDetail } = useAdmin();

  useEffect(() => {
    if (userId) {
      getUserDetail(userId);
    }
  }, [userId]);

  const formatDevice = (deviceInfo) => {
    if (!deviceInfo) return "Thiết bị không xác định";
    const ua = String(deviceInfo);
    if (ua.includes("iPhone")) return "iPhone App";
    if (ua.includes("Android")) return "Android App";
    if (ua.includes("Chrome")) return "Chrome Browser";
    return "Mobile App";
  };

  const renderItem = ({ item }) => {
    // 1. Logic xác định loại thiết bị và Icon tương ứng
    const deviceInfo = String(item.device_info || "").toLowerCase();
    let iconName = "help-circle-outline"; // Mặc định
    let iconBgColor = "#F3F4F6"; // Màu nền mặc định
    if (
      deviceInfo.includes("iphone") ||
      deviceInfo.includes("android") ||
      deviceInfo.includes("mobile")
    ) {
      iconName = "phone-portrait-outline";
      iconBgColor = "#EEF2FF"; // Màu xanh nhạt cho Mobile
    } else if (
      deviceInfo.includes("chrome") ||
      deviceInfo.includes("safari") ||
      deviceInfo.includes("mozilla") ||
      deviceInfo.includes("desktop")
    ) {
      iconName = "desktop-outline";
      iconBgColor = "#FFF7ED"; // Màu cam nhạt cho Browser
    }

    return (
      <View style={styles.historyCard}>
        {/* Thay đổi màu nền icon dựa trên loại thiết bị */}
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
          <Ionicons name={iconName} size={24} color="#2f6b3f" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.deviceText}>
            {formatDevice(item.device_info)}
          </Text>
          <Text style={styles.ipText}>
            IP: {item.ip_address || "Đang cập nhật"}
          </Text>
          <Text style={styles.dateText}>
            {item.login_time
              ? dayjs(item.login_time).format("HH:mm - DD/MM/YYYY")
              : "Vừa xong"}
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Thành công</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử của User #{userId}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#2f6b3f" />
          <Text style={{ marginTop: 10, color: "#6B7280" }}>
            Đang truy xuất dữ liệu...
          </Text>
        </View>
      ) : (
        <FlatList
          data={selectedUserHistory || []}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                User này chưa có lịch sử đăng nhập.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

// Copy nguyên styles của bạn qua đây để đồng bộ giao diện
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#2f6b3f", // Bạn có thể chỉnh màu đậm hơn một chút để phân biệt
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  listContent: { padding: 16 },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContainer: { flex: 1 },
  deviceText: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
  ipText: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  dateText: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  statusBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { color: "#10B981", fontSize: 11, fontWeight: "600" },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 10, color: "#9CA3AF", fontSize: 14 },
});

export default AdminUserLoginHistoryScreen;
