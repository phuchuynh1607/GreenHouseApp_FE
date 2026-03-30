import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { useIoT } from "../../hooks/useIoT";

const AdminScreen = ({ navigation }) => {
  const { unreadCount, markedasRead } = useIoT();
  const adminTools = [
    {
      id: 1,
      title: "Quản lý người dùng",
      subtitle: "Xem danh sách, chi tiết và lịch sử đăng nhập",
      icon: "people-circle-outline",
      color: "#429257",
      target: "UserList",
    },
    {
      id: 2,
      title: "Cấu hình hệ thống",
      subtitle: "Thiết lập ngưỡng mặc định (Temp, Soil, Light)",
      icon: "settings-outline",
      color: "#1F2937",
      target: "SystemThreshold",
    },
    {
      id: 3,
      title: "Nhật ký hệ thống",
      subtitle: "Xem toàn bộ cảnh báo thiết bị từ người dùng",
      icon: "document-text-outline",
      color: "#3B82F6",
      target: "AdminNotificationLog",
      hasBadge: true,
    },
    {
      id: 4,
      title: "Phản hồi người dùng",
      subtitle: "Xem toàn bộ phản hồi từ người dùng",
      icon: "chatbubbles-outline",
      color: "#cf5915",
      target: "AdminFeedbackList",
      hasBadge: true,
    },
  ];
  const { logout } = useAuth();
  const handleNavigate = (tool) => {
    if (tool.hasBadge) {
      markedasRead();
    }
    navigation.navigate(tool.target);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bảng điều khiển</Text>
        <Text style={styles.adminName}>Administrator</Text>
      </View>
      {/* Banner trang trí trạng thái hệ thống */}
      <View style={styles.statusBanner}>
        <View>
          <Text style={styles.statusTitle}>Trạng thái hệ thống</Text>
          <Text style={styles.statusText}>Hoạt động bình thường</Text>
        </View>
        <View style={styles.statusIndicator} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuContainer}>
          {adminTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.menuCard}
              onPress={() => handleNavigate(tool)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: tool.color + "15" },
                ]}
              >
                <Ionicons name={tool.icon} size={30} color={tool.color} />
                {tool.hasBadge && unreadCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>{tool.title}</Text>
                <Text style={styles.cardSubtitle}>{tool.subtitle}</Text>
              </View>

              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#2f6b3f",
    paddingTop: 40,
    padding: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  welcomeText: { color: "#ECFDF5", fontSize: 16, opacity: 0.8 },
  adminName: { color: "#fff", fontSize: 26, fontWeight: "bold", marginTop: 4 },
  scrollContent: { padding: 20 },
  menuContainer: { marginTop: 10 },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
  },
  // STYLE MỚI CHO BADGE
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff", // Tạo viền trắng cho nổi bật
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  textWrapper: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#111827" },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 16,
  },
  statusBanner: {
    marginTop: -15, // Kéo banner lên đè nhẹ vào header cho đẹp
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  statusTitle: { fontSize: 14, color: "#9CA3AF" },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#10B981",
    marginTop: 2,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    marginTop: 20,
  },
  logoutBtnText: {
    marginLeft: 10,
    color: "#EF4444",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AdminScreen;
