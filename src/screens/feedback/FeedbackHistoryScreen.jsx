import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFeedback } from "../../hooks/useFeedback";
import dayjs from "dayjs";

const FeedbackHistoryScreen = ({ navigation }) => {
  const { tickets, loading, refreshTickets, updateTicketStatus } =
    useFeedback();

  useEffect(() => {
    refreshTickets();
  }, []);

  // --- CẬP NHẬT TRẠNG THÁI  ---
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

  // --- HÀM XỬ LÝ ĐÓNG TICKET ---
  const handleCloseTicket = (ticketId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đóng cuộc hội thoại này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đóng",
          style: "destructive",
          onPress: async () => {
            try {
              await updateTicketStatus(ticketId, "closed");
              Alert.alert("Thành công", "Đã đóng cuộc hội thoại.");
            } catch (err) {
              Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
            }
          },
        },
      ],
    );
  };

  const renderTicketItem = ({ item }) => {
    const status = getStatusStyle(item.status);
    const isClosed = item.status === "closed";

    return (
      <TouchableOpacity
        style={[styles.ticketCard, isClosed && { opacity: 0.8 }]}
        onPress={() =>
          navigation.navigate("FeedbackDetail", { ticketId: item.id })
        }
      >
        <View style={styles.ticketHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subjectText} numberOfLines={1}>
              {item.subject}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: status.bg,
                  alignSelf: "flex-start",
                  marginTop: 4,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: status.text }]}>
                {status.label}
              </Text>
            </View>
          </View>

          {!isClosed && (
            <TouchableOpacity
              onPress={() => handleCloseTicket(item.id)}
              style={styles.actionBtn}
            >
              <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.messagePreview} numberOfLines={2}>
          {item.initial_message}
        </Text>

        <View style={styles.ticketFooter}>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text style={styles.dateText}>
              {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: "#D1D5DB", marginRight: 4 }}>
              Chi tiết
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserProfileMain")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử phản hồi</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateFeedback")}
          style={styles.addButton}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && tickets.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2f6b3f" />
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
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={50}
                  color="#D1D5DB"
                />
              </View>
              <Text style={styles.emptyTitle}>Chưa có phản hồi nào</Text>
              <Text style={styles.emptySub}>
                Các yêu cầu hỗ trợ của bạn sẽ xuất hiện tại đây.
              </Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => navigation.navigate("CreateFeedback")}
              >
                <Text style={styles.createBtnText}>Gửi phản hồi ngay</Text>
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
    backgroundColor: "#2f6b3f",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  listContent: { padding: 16 },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: "bold" },
  messagePreview: {
    fontSize: 14,
    color: "#6B7280",
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
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#374151" },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  createBtn: {
    marginTop: 25,
    backgroundColor: "#2f6b3f",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createBtnText: { color: "#fff", fontWeight: "bold" },
});

export default FeedbackHistoryScreen;
