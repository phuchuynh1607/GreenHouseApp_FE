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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFeedback } from "../../hooks/useFeedback";
import { useAuth } from "../../hooks/useAuth";
import dayjs from "dayjs";

const FeedbackDetailScreen = ({ route, navigation }) => {
  const { ticketId } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { currentTicket, getTicketDetails, sendNewMessage, loading } =
    useFeedback();

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  // Load dữ liệu chat khi vào màn hình
  useEffect(() => {
    getTicketDetails(ticketId);
  }, [ticketId]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    setSending(true);
    try {
      await sendNewMessage(ticketId, messageText);
      setMessageText("");
      // Cuộn xuống cuối sau khi gửi
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    } catch (err) {
      console.error("Gửi tin nhắn lỗi:", err);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === user?.id;

    return (
      <View
        style={[styles.messageRow, isMe ? styles.myMsgRow : styles.adminMsgRow]}
      >
        {!isMe && (
          <View style={styles.adminAvatar}>
            <Ionicons name="person" size={16} color="#fff" />
          </View>
        )}
        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.adminBubble]}
        >
          <Text
            style={[
              styles.msgText,
              isMe ? styles.myMsgText : styles.adminMsgText,
            ]}
          >
            {item.message_content}
          </Text>
          <Text
            style={[
              styles.timeText,
              isMe ? styles.myTimeText : styles.adminTimeText,
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentTicket?.subject || "Chi tiết hỗ trợ"}
          </Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerSub}>ID: #{ticketId}</Text>
            {currentTicket?.status === "closed" && (
              <View style={styles.closedBadge}>
                <Text style={styles.closedBadgeText}>ĐÃ ĐÓNG</Text>
              </View>
            )}
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat List */}
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {loading && !currentTicket ? (
          <ActivityIndicator style={{ flex: 1 }} color="#2f6b3f" />
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

        {/* Input Area or Closed Message */}
        {currentTicket?.status === "closed" ? (
          <View
            style={[styles.closedArea, { paddingBottom: insets.bottom + 20 }]}
          >
            <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
            <Text style={styles.closedText}>
              Cuộc hội thoại đã kết thúc. Bạn chỉ có thể xem lịch sử.
            </Text>
          </View>
        ) : (
          <View
            style={[styles.inputArea, { paddingBottom: insets.bottom + 10 }]}
          >
            <TextInput
              style={styles.input}
              placeholder="Nhập nội dung phản hồi..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!messageText.trim() || sending) && styles.sendBtnDisabled,
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
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#429257",
  },
  headerInfo: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  closedBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 8,
  },
  closedBadgeText: { color: "#fff", fontSize: 9, fontWeight: "bold" },
  backBtn: { padding: 5 },

  listContent: { padding: 15, paddingBottom: 30 },
  messageRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  myMsgRow: { justifyContent: "flex-end" },
  adminMsgRow: { justifyContent: "flex-start" },

  adminAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: "#2f6b3f",
    borderBottomRightRadius: 2,
  },
  adminBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  msgText: { fontSize: 15, lineHeight: 22 },
  myMsgText: { color: "#fff" },
  adminMsgText: { color: "#1F2937" },

  timeText: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  myTimeText: { color: "rgba(255,255,255,0.7)" },
  adminTimeText: { color: "#9CA3AF" },

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
    fontSize: 15,
    color: "#1F2937",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#429257",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendBtnDisabled: { backgroundColor: "#D1D5DB" },

  closedArea: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  closedText: {
    color: "#6B7280",
    fontSize: 13,
    marginLeft: 8,
    fontStyle: "italic",
  },
});

export default FeedbackDetailScreen;
