import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const InputField = React.forwardRef(
  ({ label, error, style, ...props }, ref) => {
    return (
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TextInput
          {...props}
          ref={ref}
          style={[
            styles.input,
            error ? styles.inputError : styles.inputDefault,
            style,
          ]}
          placeholderTextColor="#999"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#2f6b3f",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    fontSize: 16,
    color: "#2f6b3f",
  },
  inputDefault: {
    borderBottomColor: "#6366F1",
  },
  inputError: {
    borderBottomColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 11,
    marginTop: 4,
  },
});

export default InputField;
