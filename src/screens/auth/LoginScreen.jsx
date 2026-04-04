import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginSchema } from "../../schemas/loginSchema";
import ControlledInput from "../../components/ControlledInput";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });
  const rememberMeValue = watch("rememberMe");
  useEffect(() => {
    const loadRememberedUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("rememberedUser");
        const savedPass = await AsyncStorage.getItem("rememberedUserPassword");

        if (savedUser && savedPass) {
          setValue("username", savedUser);
          setValue("password", savedPass);
          setValue("rememberMe", true);
        }
      } catch (e) {
        console.error("Không thể tải thông tin ghi nhớ");
      }
    };
    loadRememberedUser();
  }, [setValue]);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await login(data.username, data.password);
      if (data.rememberMe) {
        await AsyncStorage.setItem("rememberedUser", data.username);
        await AsyncStorage.setItem("rememberedUserPassword", data.password);
      } else {
        await AsyncStorage.removeItem("rememberedUser");
        await AsyncStorage.removeItem("rememberedUserPassword");
      }
    } catch (err) {
      const backendDetail = err.response?.data?.detail;
      setServerError(
        Array.isArray(backendDetail)
          ? backendDetail[0].msg
          : typeof backendDetail === "string"
            ? backendDetail
            : "Đăng nhập thất bại",
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay trở lại</Text>
        </View>

        {serverError && <Text style={styles.errorText}>{serverError}</Text>}

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
          placeholder="Nhập mật khẩu"
          secureTextEntry={true}
        />

        {/* Tùy chọn Ghi nhớ & Quên mật khẩu */}
        <View style={styles.optionsRow}>
          <View style={styles.rememberMeContainer}>
            <Switch
              value={rememberMeValue}
              onValueChange={(val) => setValue("rememberMe", val)}
              trackColor={{ false: "#D1D5DB", true: "#2f6b3f" }}
              thumbColor="#fff"
            />
            <Text style={styles.optionsText}>Ghi nhớ tôi</Text>
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert("Thông báo", "Vui lòng liên hệ Admin")}
          >
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          variant="login_register"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        >
          Đăng nhập
        </CustomButton>

        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.footerText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2f6b3f",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: { marginBottom: 25 },
  title: { fontSize: 28, fontWeight: "bold", color: "rgb(45, 173, 51)" },
  subtitle: { fontSize: 14, color: "#3b8b50", marginTop: 5 },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  rememberMeContainer: { flexDirection: "row", alignItems: "center" },
  optionsText: { marginLeft: 8, color: "#2f6b3f", fontSize: 14 },
  forgotText: { color: "#2f6b3f", fontSize: 14, fontWeight: "600" },
  footerLink: { marginTop: 25, alignItems: "center" },
  footerText: {
    color: "#2f6b3f",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
