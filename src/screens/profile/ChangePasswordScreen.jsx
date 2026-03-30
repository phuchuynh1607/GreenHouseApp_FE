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
import { useUserProfile } from "../../hooks/useUserProfile";

const ChangePasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { changePassword } = useUserProfile;
  // State quản lý mật khẩu
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State ẩn/hiện mật khẩu
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    // Validation cơ bản
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ các trường.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Xác nhận mật khẩu mới không khớp.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        password: currentPassword,
        new_password: newPassword,
      });

      Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      Alert.alert("Thất bại", error.message);
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    isShow,
    toggleShow,
    placeholder,
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          secureTextEntry={!isShow}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={toggleShow} style={styles.eyeIcon}>
          <Ionicons
            name={isShow ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[styles.container]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Đổi mật khẩu</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.content}>
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark" size={24} color="#2f6b3f" />
              <Text style={styles.infoText}>
                Mật khẩu mới nên bao gồm chữ cái, số và ký tự đặc biệt để bảo vệ
                tài khoản tốt hơn.
              </Text>
            </View>

            <PasswordInput
              label="Mật khẩu hiện tại"
              value={passwords.currentPassword}
              onChange={(txt) =>
                setPasswords({ ...passwords, currentPassword: txt })
              }
              isShow={showPass.current}
              toggleShow={() =>
                setShowPass({ ...showPass, current: !showPass.current })
              }
              placeholder="Nhập mật khẩu đang dùng"
            />

            <PasswordInput
              label="Mật khẩu mới"
              value={passwords.newPassword}
              onChange={(txt) =>
                setPasswords({ ...passwords, newPassword: txt })
              }
              isShow={showPass.new}
              toggleShow={() =>
                setShowPass({ ...showPass, new: !showPass.new })
              }
              placeholder="Tối thiểu 6 ký tự"
            />

            <PasswordInput
              label="Xác nhận mật khẩu mới"
              value={passwords.confirmPassword}
              onChange={(txt) =>
                setPasswords({ ...passwords, confirmPassword: txt })
              }
              isShow={showPass.confirm}
              toggleShow={() =>
                setShowPass({ ...showPass, confirm: !showPass.confirm })
              }
              placeholder="Nhập lại mật khẩu mới"
            />

            <TouchableOpacity
              style={[styles.btnSubmit, loading && { opacity: 0.7 }]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Cập nhật mật khẩu</Text>
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
    backgroundColor: "#429257",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  content: { padding: 25 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    color: "#2f6b3f",
    fontSize: 13,
    marginLeft: 12,
    lineHeight: 18,
  },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  eyeIcon: { padding: 12 },

  btnSubmit: {
    backgroundColor: "#2f6b3f",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#2f6b3f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ChangePasswordScreen;
