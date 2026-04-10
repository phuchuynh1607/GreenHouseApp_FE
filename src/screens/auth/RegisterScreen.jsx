import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas/registerSchema";
import ControlledInput from "../../components/ControlledInput";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../hooks/useAuth";

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const { register: registerApi } = useAuth();

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const passwordValue = watch("password", "");

  const getStrengthConfig = (password) => {
    if (!password) return { color: "#D1D5DB", text: "" };
    if (password.length < 6) return { color: "#EF4444", text: "Yếu" };
    if (password.length < 10) return { color: "#F59E0B", text: "Trung bình" };
    return { color: "#10B981", text: "Mạnh" };
  };

  const strength = getStrengthConfig(passwordValue);

  const nextStep = async () => {
    const fieldsToValidate = [
      "first_name",
      "last_name",
      "email",
      "phone_number",
    ];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep(2);
    } else {
      // Tìm lỗi đầu tiên xuất hiện trong các trường ở Bước 1
      const firstErrorKey = fieldsToValidate.find((field) => errors[field]);
      if (firstErrorKey) {
        Alert.alert("Thông tin chưa đúng", errors[firstErrorKey]?.message);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      await registerApi(data);
      Alert.alert(
        "Thành công",
        "Tạo tài khoản thành công! Mời bạn đăng nhập.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      );
    } catch (err) {
      const serverError = err.response?.data?.detail;
      const errorMessage = Array.isArray(serverError)
        ? serverError[0].msg
        : serverError || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      Alert.alert("Lỗi đăng ký", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.stepIndicator}>Bước {step} / 2</Text>
          </View>

          {/* STEP 1: Sử dụng display để giữ state */}
          <View style={{ display: step === 1 ? "flex" : "none" }}>
            <ControlledInput
              control={control}
              name="email"
              label="Email"
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                <ControlledInput
                  control={control}
                  name="first_name"
                  label="Họ"
                  placeholder="Họ"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <ControlledInput
                  control={control}
                  name="last_name"
                  label="Tên"
                  placeholder="Tên"
                />
              </View>
            </View>
            <ControlledInput
              control={control}
              name="phone_number"
              label="Số điện thoại"
              placeholder="09xx xxx xxx"
              keyboardType="numeric"
              maxLength={10}
            />
            <CustomButton style={styles.mt20} onPress={nextStep}>
              Tiếp tục
            </CustomButton>
          </View>

          {/* STEP 2 */}
          <View style={{ display: step === 2 ? "flex" : "none" }}>
            <ControlledInput
              control={control}
              name="username"
              label="Tên đăng nhập"
              placeholder="Nhập username"
              autoCapitalize="none"
            />
            <ControlledInput
              control={control}
              name="password"
              label="Mật khẩu"
              placeholder="******"
              secureTextEntry={true}
            />

            {passwordValue.length > 0 && (
              <View style={styles.strengthRow}>
                <View
                  style={[
                    styles.strengthDot,
                    { backgroundColor: strength.color },
                  ]}
                />
                <Text style={[styles.strengthText, { color: strength.color }]}>
                  {strength.text}
                </Text>
              </View>
            )}

            <ControlledInput
              control={control}
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="******"
              secureTextEntry={true}
            />
            <Text style={styles.warningText}>
              ⚠️ Bạn sẽ dùng username và mật khẩu này để đăng nhập sau này.
            </Text>

            <View style={styles.actionRow}>
              <CustomButton
                variant="outline"
                style={{ flex: 1 }}
                onPress={() => setStep(1)}
              >
                Quay lại
              </CustomButton>
              <CustomButton
                variant="login_register"
                style={{ flex: 2 }}
                isLoading={isSubmitting}
                onPress={handleSubmit(onSubmit, (err) => {
                  console.log("Lỗi Validation:", err);
                  const firstError = Object.values(err)[0];
                  Alert.alert("Lỗi nhập liệu", firstError?.message);
                })}
              >
                Đăng ký
              </CustomButton>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.footerLink}
          >
            <Text style={styles.footerText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#2f6b3f",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: { alignItems: "center", marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2f633d",
    marginBottom: 10,
  },
  stepIndicator: { fontSize: 12, color: "#2f6b3f", fontWeight: "bold" },
  rowInputs: { flexDirection: "row" },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: -5,
  },
  strengthDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  strengthText: { fontSize: 12, fontWeight: "600" },
  warningText: {
    fontSize: 11,
    color: "#53b16c",
    textAlign: "center",
    marginTop: 5,
  },
  mt20: { marginTop: 20 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  footerLink: { marginTop: 25, alignItems: "center" },
  footerText: {
    color: "#2f6b3f",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
