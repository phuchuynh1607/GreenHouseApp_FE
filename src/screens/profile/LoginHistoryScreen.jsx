import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserProfile } from "../../hooks/useUserProfile";
import dayjs from "dayjs"; // Nên dùng để format thời gian cho đẹp
import { useEffect } from "react";
const LoginHistoryScreen = ({ navigation }) => {
  const { loginHistory, loading, refreshProfile } = useUserProfile();
  const insets = useSafeAreaInsets();

  // Tự động làm mới dữ liệu khi mở màn hình
  useEffect(() => {
    if (refreshProfile) {
      refreshProfile();
    }
  }, []);

  // Hàm format thiết bị an toàn (Sửa lỗi .includes)
  const formatDevice = (deviceInfo) => {
    if (!deviceInfo) return "Thiết bị không xác định";
    const ua = String(deviceInfo);
    if (ua.includes("iPhone")) return "iPhone App";
    if (ua.includes("Android")) return "Android App";
    if (ua.includes("Chrome")) return "Chrome Browser";
    return "Mobile App";
  };

  const renderItem = ({ item }) => {
    // Kiểm tra an toàn cho item
    if (!item) return null;

    return (
      <View style={styles.historyCard}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={
              item.device_info?.includes("Mobile") ||
              item.device_info?.includes("iPhone")
                ? "phone-portrait-outline"
                : "desktop-outline"
            }
            size={24}
            color="#2f6b3f"
          />
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
    <View style={[styles.container]}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đăng nhập</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#2f6b3f" />
          <Text style={{ marginTop: 10, color: "#6B7280" }}>
            Đang tải lịch sử...
          </Text>
        </View>
      ) : (
        <FlatList
          data={loginHistory || []} // Đảm bảo luôn là mảng, không bị undefined
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={60}
                color="#D1D5DB"
              />
              <Text style={styles.emptyText}>
                Chưa có dữ liệu đăng nhập nào.
              </Text>
              <TouchableOpacity
                onPress={() => refreshProfile && refreshProfile()}
                style={{ marginTop: 15 }}
              >
                <Text style={{ color: "#2f6b3f", fontWeight: "bold" }}>
                  Thử tải lại
                </Text>
              </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#429257",
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

  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 10, color: "#9CA3AF", fontSize: 14 },
});

export default LoginHistoryScreen;
