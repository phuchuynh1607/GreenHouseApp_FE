import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfile } from "../../hooks/useUserProfile";

const EditProfileScreen = ({ navigation }) => {
  const { profile, updateProfile, loading } = useUserProfile();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  const BASE_URL = "http://172.16.5.193:8000";

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
      });
      // LOGIC XỬ LÝ ẢNH TỪ FILE CŨ: Ưu tiên ảnh profile từ server
      if (profile.user_image) {
        setPreviewUri(`${BASE_URL}/${profile.user_image}`);
      }
    }
  }, [profile]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // Thay đổi dòng này
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setPreviewUri(uri); // Cập nhật preview bằng ảnh vừa chọn từ máy
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData, selectedImage);
      Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thông tin.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[styles.container]}>
          {/* Header giữ giao diện hiện đại */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
            <TouchableOpacity onPress={handleSave} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#2f6b3f" />
              ) : (
                <Text style={styles.saveBtnText}>Lưu</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {previewUri ? (
                <Image source={{ uri: previewUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={60} color="#9CA3AF" />
                </View>
              )}
              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ</Text>
              <TextInput
                style={styles.input}
                value={formData.first_name}
                onChangeText={(txt) =>
                  setFormData({ ...formData, first_name: txt })
                }
                placeholder="Nhập họ"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên</Text>
              <TextInput
                style={styles.input}
                value={formData.last_name}
                onChangeText={(txt) =>
                  setFormData({ ...formData, last_name: txt })
                }
                placeholder="Nhập tên"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={formData.phone_number}
                onChangeText={(txt) =>
                  setFormData({ ...formData, phone_number: txt })
                }
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#6B7280"
              />
              <Text style={styles.infoText}>
                Email và Tên đăng nhập không thể thay đổi để đảm bảo an toàn.
              </Text>
            </View>
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
  saveBtnText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  avatarSection: { alignItems: "center", marginVertical: 30 },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#2f6b3f",
    padding: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  changePhotoText: { marginTop: 12, color: "#2f6b3f", fontWeight: "600" },
  form: { paddingHorizontal: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: "#6B7280", marginBottom: 8, fontWeight: "500" },
  input: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  infoText: { flex: 1, fontSize: 13, color: "#6B7280", marginLeft: 10 },
});

export default EditProfileScreen;
