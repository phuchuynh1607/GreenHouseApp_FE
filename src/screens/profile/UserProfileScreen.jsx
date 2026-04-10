import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuth } from "../../hooks/useAuth";

const UserProfileScreen = ({ navigation }) => {
  const { profile } = useUserProfile();
  const { logout } = useAuth();

  const BASE_URL = "http://10.10.93.246:8000";

  // Logic hiển thị ảnh: Nếu có ảnh từ server thì dùng, không thì dùng Icon mặc định
  const renderAvatar = () => {
    if (profile?.user_image) {
      return (
        <Image
          source={{ uri: `${BASE_URL}/${profile.user_image}` }}
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={[styles.avatar, styles.avatarPlaceholder]}>
        <Ionicons name="person" size={50} color="#9CA3AF" />
      </View>
    );
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
    color = "#1F2937",
    isLast = false,
  }) => (
    <TouchableOpacity
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        {renderAvatar()}
        <Text style={styles.username}>
          {profile?.first_name} {profile?.last_name || "Người dùng"}
        </Text>
        <Text style={styles.emailText}>{profile?.email}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Tài khoản & Bảo mật</Text>
        <View style={styles.card}>
          <MenuItem
            icon="lock-closed-outline"
            title="Đổi mật khẩu"
            onPress={() => navigation.navigate("ChangePassword")}
            color="#2f6b3f"
          />
          <MenuItem
            icon="shield-checkmark-outline"
            title="Lịch sử đăng nhập"
            onPress={() => navigation.navigate("LoginHistory")}
            color="#10B981"
          />
          <MenuItem
            icon="notifications-outline"
            title="Lịch sử cảnh báo"
            onPress={() => {
              navigation.navigate("NotificationsHistory");
            }}
            color="#F59E0B"
            isLast={true}
          />
        </View>

        <Text style={styles.sectionTitle}>Hỗ trợ</Text>
        <View style={styles.card}>
          <MenuItem
            icon="chatbubbles-outline"
            title="Gửi phản hồi mới"
            onPress={() => navigation.navigate("CreateFeedback")}
            color="#3B82F6"
          />
          <MenuItem
            icon="list-outline"
            title="Lịch sử phản hồi"
            onPress={() => navigation.navigate("FeedbackHistory")}
            color="#8B5CF6"
            isLast={true}
          />
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  avatarPlaceholder: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  username: { fontSize: 22, fontWeight: "bold", color: "#1F2937" },
  emailText: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  editButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#2f6b3f",
  },
  editButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  menuSection: { padding: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#9CA3AF",
    marginBottom: 10,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 25,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: { padding: 8, borderRadius: 10, marginRight: 15 },
  menuTitle: { fontSize: 16, fontWeight: "500", color: "#374151" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    marginTop: 10,
  },
  logoutBtnText: {
    marginLeft: 10,
    color: "#EF4444",
    fontWeight: "bold",
    fontSize: 16,
  },
  inlineBadge: {
    backgroundColor: "#EF4444",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default UserProfileScreen;
