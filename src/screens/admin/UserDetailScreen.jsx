import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAdmin } from "../../hooks/useAdmin";

const UserDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { selectedUserDetail, loading, getUserDetail, deleteUser } = useAdmin();

  const BASE_URL = "http://10.10.67.126:8000";

  useEffect(() => {
    if (userId) {
      getUserDetail(userId);
    }
  }, [userId]);

  if (loading && !selectedUserDetail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2f6b3f" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin chi tiết</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Avatar Section - Bự hơn theo ý bạn */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {selectedUserDetail?.user_image ? (
              <Image
                source={{ uri: `${BASE_URL}/${selectedUserDetail.user_image}` }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={80} color="#9CA3AF" />
              </View>
            )}
          </View>
          <Text style={styles.displayUserName}>
            {selectedUserDetail?.first_name} {selectedUserDetail?.last_name}
          </Text>
          <Text style={styles.displayUserEmail}>
            {selectedUserDetail?.email}
          </Text>
        </View>

        {/* Info Section - Read Only */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <Text style={styles.value}>{selectedUserDetail?.username}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Số điện thoại</Text>
            <Text style={styles.value}>
              {selectedUserDetail?.phone_number || "Chưa cập nhật"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>ID Hệ thống</Text>
            <Text style={styles.value}>#{selectedUserDetail?.id}</Text>
          </View>
        </View>

        {/* Action Buttons for Admin */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() =>
              navigation.navigate("UserLoginHistory", {
                userId: selectedUserDetail.id,
              })
            }
          >
            <Ionicons name="time-outline" size={22} color="#fff" />
            <Text style={styles.historyButtonText}>Xem lịch sử đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteUser(selectedUserDetail.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Xóa người dùng này</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { paddingBottom: 40 },
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
  avatarSection: { alignItems: "center", marginTop: 40, marginBottom: 30 },
  avatarWrapper: {
    padding: 4,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 15,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F3F4F6",
  },
  avatarPlaceholder: { justifyContent: "center", alignItems: "center" },
  displayUserName: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  displayUserEmail: { fontSize: 15, color: "#6B7280", marginTop: 5 },

  infoContainer: { paddingHorizontal: 25, marginTop: 10 },
  infoItem: {
    backgroundColor: "#F9FAFB",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  value: { fontSize: 16, color: "#1F2937", fontWeight: "500" },

  actionContainer: { paddingHorizontal: 25, marginTop: 20 },
  historyButton: {
    flexDirection: "row",
    backgroundColor: "#2f6b3f",
    paddingVertical: 15,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#2f6b3f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  historyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  deleteButton: {
    flexDirection: "row",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#6B7280" },
});

export default UserDetailScreen;
