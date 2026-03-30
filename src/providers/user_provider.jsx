import { useState, useEffect, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { useAuth } from "../hooks/useAuth";
import {
  fetchUserInfo,
  updateUserInfo,
  uploadAvatarApi,
  fetchLoginHistory,
  changePasswordApi,
} from "../services/user.service";
export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoginHistory([]);
      return;
    }
    setLoading(true);
    try {
      // Gọi song song cả 2 để tối ưu thời gian
      const [userData, historyData] = await Promise.all([
        fetchUserInfo(),
        fetchLoginHistory(),
      ]);
      setProfile(userData);
      setLoginHistory(historyData);
    } catch (err) {
      console.error("Fetch profile/history error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateProfile = async (profileData, selectedFileUri) => {
    setLoading(true);
    try {
      let finalImagePath = profile?.user_image || "";

      if (selectedFileUri) {
        const uploadResponse = await uploadAvatarApi(selectedFileUri);
        if (uploadResponse && uploadResponse.url) {
          finalImagePath = uploadResponse.url;
        }
      }
      const payload = {
        ...profileData,
        user_image: finalImagePath,
      };

      const updatedUser = await updateUserInfo(payload);
      setProfile(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Thêm hàm đổi mật khẩu
  const handleChangePassword = async (passwordData) => {
    setLoading(true);
    try {
      // passwordData cần có format: { password: string, new_password: string }
      await changePasswordApi({
        password: passwordData.password,
        new_password: passwordData.new_password,
      });
      return { success: true, message: "Đổi mật khẩu thành công" };
    } catch (error) {
      console.error("Change password error:", error);

      let errorMessage = "Không thể đổi mật khẩu. Vui lòng thử lại sau.";

      if (error.response?.status === 401) {
        errorMessage = "Mật khẩu hiện tại không chính xác.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <UserContext.Provider
      value={{
        profile,
        loginHistory,
        loading,
        updateProfile: handleUpdateProfile,
        refreshProfile: getProfile,
        changePassword: handleChangePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
