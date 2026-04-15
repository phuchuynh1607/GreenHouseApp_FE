import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFeedback } from "../../hooks/useFeedback";
import dayjs from "dayjs";

const AdminFeedbackListScreen = ({ navigation }) => {
  const { tickets, loading, refreshTickets } = useFeedback();

  useEffect(() => {
    refreshTickets();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "#FEF3C7", text: "#D97706", label: "Đang chờ" };
      case "processing":
        return { bg: "#DBEAFE", text: "#2563EB", label: "Đang xử lý" };
      case "resolved":
        return { bg: "#D1FAE5", text: "#059669", label: "Đã giải quyết" };
      case "closed":
        return { bg: "#d52525", text: "#ffffffc1", label: "Đã đóng" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280", label: status || "Không rõ" };
    }
  };

  const renderTicketItem = ({ item }) => {
    const status = getStatusStyle(item.status);

    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() =>
          navigation.navigate("AdminFeedbackDetail", { ticketId: item.id })
        }
      >
        <View style={styles.ticketHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.userRow}>
              <Ionicons
                name="person-circle-outline"
                size={16}
                color="#4B5563"
              />
              {/* Hiển thị tên User gửi - Giả định BE trả về user_name hoặc email */}
              <Text style={styles.userNameText}>{item.user_name}</Text>
            </View>
            <Text style={styles.subjectText} numberOfLines={1}>
              {item.subject}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={styles.messagePreview} numberOfLines={2}>
          {item.initial_message}
        </Text>

        <View style={styles.ticketFooter}>
          <View style={styles.timeInfo}>
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <Text style={styles.dateText}>
              {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Admin */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý phản hồi</Text>
        <TouchableOpacity onPress={refreshTickets} style={styles.refreshButton}>
          <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && tickets.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1F2937" />
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicketItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshTickets} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Hộp thư trống</Text>
              <Text style={styles.emptySub}>
                Hiện chưa có yêu cầu hỗ trợ nào từ người dùng.
              </Text>
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
    backgroundColor: "#2f6b3f",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  listContent: { padding: 16 },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2f6b3f",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 4,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: "bold" },
  messagePreview: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  timeInfo: { flexDirection: "row", alignItems: "center" },
  dateText: { fontSize: 12, color: "#9CA3AF", marginLeft: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 10,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 5,
  },
});

export default AdminFeedbackListScreen;
