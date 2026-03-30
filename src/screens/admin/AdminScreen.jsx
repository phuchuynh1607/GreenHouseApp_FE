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

const AdminScreen = ({ navigation }) => {
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
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bảng điều khiển</Text>
        <Text style={styles.adminName}>Administrator</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuContainer}>
          {adminTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.menuCard}
              onPress={() => navigation.navigate(tool.target)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: tool.color + "15" },
                ]}
              >
                <Ionicons name={tool.icon} size={30} color={tool.color} />
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

        {/* Banner trang trí trạng thái hệ thống */}
        <View style={styles.statusBanner}>
          <View>
            <Text style={styles.statusTitle}>Trạng thái hệ thống</Text>
            <Text style={styles.statusText}>Hoạt động bình thường</Text>
          </View>
          <View style={styles.statusIndicator} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#2f6b3f",
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  textWrapper: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#111827" },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 16,
  },
  statusBanner: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F3F4F6",
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
});

export default AdminScreen;
