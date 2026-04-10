import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfile } from "../../hooks/useUserProfile";
import { changePasswordSchema } from "../../schemas/changePasswordSchema";

const ChangePasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { changePassword } = useUserProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await changePassword({
        password: data.password,
        new_password: data.newPassword,
      });

      Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Change password error:", error);

      let errorMessage = "Không thể đổi mật khẩu";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Thất bại", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({
    name,
    label,
    placeholder,
    showPass,
    onToggleShow,
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              secureTextEntry={!showPass}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
        <TouchableOpacity onPress={onToggleShow} style={styles.eyeIcon}>
          <Ionicons
            name={showPass ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name].message}</Text>
      )}
    </View>
  );

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

            <PasswordField
              name="password"
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu đang dùng"
              showPass={showPass.current}
              onToggleShow={() =>
                setShowPass({ ...showPass, current: !showPass.current })
              }
            />

            <PasswordField
              name="newPassword"
              label="Mật khẩu mới"
              placeholder="Tối thiểu 6 ký tự"
              showPass={showPass.new}
              onToggleShow={() =>
                setShowPass({ ...showPass, new: !showPass.new })
              }
            />

            <PasswordField
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              showPass={showPass.confirm}
              onToggleShow={() =>
                setShowPass({ ...showPass, confirm: !showPass.confirm })
              }
            />

            <TouchableOpacity
              style={[styles.btnSubmit, loading && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
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
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#429257",
  },
  backButton: { padding: 5 },
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
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ChangePasswordScreen;
