import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFeedback } from "../../hooks/useFeedback";
import { useAuth } from "../../hooks/useAuth";
import dayjs from "dayjs";

const AdminFeedbackDetailScreen = ({ route, navigation }) => {
  const { ticketId } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    currentTicket,
    getTicketDetails,
    sendNewMessage,
    loading,
    updateTicketStatus,
  } = useFeedback();

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    getTicketDetails(ticketId);
  }, [ticketId]);

  const handleUpdateStatus = (newStatus) => {
    Alert.alert(
      "Xác nhận",
      `Chuyển trạng thái ticket sang: ${newStatus.toUpperCase()}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Cập nhật",
          onPress: async () => {
            try {
              await updateTicketStatus(ticketId, newStatus);
              Alert.alert("Thành công", "Đã cập nhật trạng thái mới.");
            } catch (err) {
              Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
            }
          },
        },
      ],
    );
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;
    setSending(true);
    try {
      await sendNewMessage(ticketId, messageText);
      setMessageText("");
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    } catch (err) {
      console.error("Gửi lỗi:", err);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === user?.id; // Admin gửi
    return (
      <View
        style={[styles.messageRow, isMe ? styles.myMsgRow : styles.userMsgRow]}
      >
        {!isMe && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={14} color="#fff" />
          </View>
        )}
        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.userBubble]}
        >
          <Text
            style={[
              styles.msgText,
              isMe ? styles.myMsgText : styles.userMsgText,
            ]}
          >
            {item.message_content}
          </Text>
          <Text
            style={[
              styles.timeText,
              isMe ? styles.myTimeText : styles.userTimeText,
            ]}
          >
            {dayjs(item.created_at).format("HH:mm")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Admin */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentTicket?.subject}
          </Text>
          <Text style={styles.headerSub}>
            Khách hàng: {currentTicket?.user_name || "N/A"}
          </Text>
        </View>
        <View style={styles.statusLabel}>
          <Text style={styles.statusLabelText}>
            {currentTicket?.status?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Thanh điều khiển trạng thái (Quick Actions) */}
      {currentTicket?.status !== "closed" && (
        <View style={styles.adminToolBar}>
          <Text style={styles.toolTitle}>Trạng thái:</Text>
          <View style={styles.btnGroup}>
            {["processing", "resolved", "closed"].map((st) => (
              <TouchableOpacity
                key={st}
                style={[styles.statusBtn, { backgroundColor: getStatusBg(st) }]}
                onPress={() => handleUpdateStatus(st)}
              >
                <Text style={styles.statusBtnText}>
                  {st === "processing"
                    ? "Xử lý"
                    : st === "resolved"
                      ? "Xong"
                      : "Đóng"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {loading && !currentTicket ? (
          <ActivityIndicator style={{ flex: 1 }} color="#1F2937" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentTicket?.messages || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />
        )}

        {/* Khu vực nhập liệu (Ẩn nếu ticket đã đóng) */}
        {currentTicket?.status !== "closed" ? (
          <View
            style={[styles.inputArea, { paddingBottom: insets.bottom + 10 }]}
          >
            <TextInput
              style={styles.input}
              placeholder="Trả lời người dùng..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !messageText.trim() && { backgroundColor: "#D1D5DB" },
              ]}
              onPress={handleSend}
              disabled={!messageText.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[styles.closedNotice, { paddingBottom: insets.bottom + 20 }]}
          >
            <Text style={styles.closedNoticeText}>
              Ticket này đã đóng. Không thể gửi thêm tin nhắn.
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const getStatusBg = (s) => {
  if (s === "processing") return "#3B82F6";
  if (s === "resolved") return "#10B981";
  return "#EF4444";
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#1F2937",
  },
  headerInfo: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  headerSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  statusLabel: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusLabelText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  backBtn: { padding: 5 },

  adminToolBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B7280",
    marginRight: 10,
  },
  btnGroup: { flexDirection: "row", flex: 1, justifyContent: "space-around" },
  statusBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusBtnText: { color: "#fff", fontSize: 11, fontWeight: "bold" },

  listContent: { padding: 15 },
  messageRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  myMsgRow: { justifyContent: "flex-end" },
  userMsgRow: { justifyContent: "flex-start" },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4B5563",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 18 },
  myBubble: { backgroundColor: "#1F2937", borderBottomRightRadius: 2 },
  userBubble: { backgroundColor: "#fff", borderBottomLeftRadius: 2 },
  msgText: { fontSize: 15 },
  myMsgText: { color: "#fff" },
  userMsgText: { color: "#1F2937" },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  myTimeText: { color: "rgba(255,255,255,0.5)" },
  userTimeText: { color: "#9CA3AF" },

  inputArea: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  closedNotice: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  closedNoticeText: { color: "#9CA3AF", fontStyle: "italic", fontSize: 13 },
});

export default AdminFeedbackDetailScreen;
