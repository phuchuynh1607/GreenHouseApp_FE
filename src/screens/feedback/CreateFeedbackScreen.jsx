import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFeedback } from "../../hooks/useFeedback";

const CreateFeedback = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Sử dụng hook useFeedback
  const { createTicket, refreshTickets } = useFeedback();

  const handleSubmit = async () => {
    // Validation
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    setLoading(true);
    try {
      // Gọi createTicket từ context thay vì gọi trực tiếp API
      await createTicket(subject, message);

      // Refresh lại danh sách tickets để cập nhật UI ở màn hình khác
      await refreshTickets();

      Alert.alert(
        "Gửi thành công",
        "Phản hồi của bạn đã được gửi tới ban quản trị. Chúng tôi sẽ sớm phản hồi lại.",
        [{ text: "OK", onPress: () => navigation.navigate("FeedbackHistory") }],
      );
    } catch (error) {
      console.error("Feedback error:", error);
      Alert.alert(
        "Lỗi",
        error.message ||
          "Không thể gửi phản hồi lúc này. Vui lòng thử lại sau.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[styles.container]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="close-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Gửi phản hồi</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>
              Bạn gặp sự cố kỹ thuật hay có góp ý gì cho hệ thống? Hãy để lại
              lời nhắn bên dưới nhé!
            </Text>

            {/* Input Tiêu đề */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chủ đề</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Ví dụ: Lỗi cảm biến, Góp ý giao diện..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Input Nội dung */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nội dung chi tiết</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Mô tả chi tiết vấn đề của bạn..."
                placeholderTextColor="#9CA3AF"
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Nút gửi */}
            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="send"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.submitText}>Gửi yêu cầu hỗ trợ</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff" },
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
  title: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  backButton: { padding: 4 },

  content: { padding: 20 },
  description: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 30,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 150,
    paddingTop: 12,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#2f6b3f",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#2f6b3f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default CreateFeedback;
