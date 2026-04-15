import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

const ControlledInput = ({
  control,
  name,
  label,
  secureTextEntry,
  ...textInputProps
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry && !passwordVisible}
              {...textInputProps}
            />

            {/* Hiển thị icon nếu là trường mật khẩu */}
            {secureTextEntry && (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            )}
          </View>

          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, color: "#4B5563", marginBottom: 5, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  inputError: { borderColor: "#EF4444" },
  iconContainer: { padding: 10 },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 4 },
});

export default ControlledInput;
