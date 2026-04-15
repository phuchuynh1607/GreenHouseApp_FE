import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

const CustomButton = ({
  children,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  isLoading = false,
  leftIcon = null,
  ...props
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant] || styles.primary,
    disabled || isLoading ? styles.disabled : null,
    style,
  ];

  const contentStyles = [
    styles.textBase,
    variant === "outline" ? styles.textOutline : styles.textPrimary,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={buttonStyles}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "outline" ? "#2f6b3f" : "#fff"} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <Text style={contentStyles}>{children}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 48,
  },
  primary: {
    backgroundColor: "#3c7726",
  },
  login_register: {
    backgroundColor: "#2f6b3f",
    borderRadius: 25,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2f6b3f",
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  textBase: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textPrimary: {
    color: "#ffffff",
  },
  textOutline: {
    color: "#2f6b3f",
  },
  icon: {
    marginRight: 8,
  },
});

export default CustomButton;
