import axiosClient from "./apiClient";
/**
 * ADMIN SERVICE
 * Quản lý các API dành riêng cho quyền Admin
 */

// 1. Lấy danh sách toàn bộ User (Chỉ những người có role là 'user')
export const fetchAllUsers = async () => {
  try {
    const response = await axiosClient.get("/admin/users/");
    return response.data;
  } catch (error) {
    console.error(
      "Fetch all users error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
// 2. Lấy thông tin chi tiết của một User cụ thể qua ID
export const fetchUserDetailbyId = async (User_Id) => {
  try {
    const response = await axiosClient.get(`/admin/user/${User_Id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Fetch user ${User_Id} error:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};
//3. Xóa user ra khỏi hệ thóng
export const DeleteUserbyId = async (User_Id) => {
  try {
    const response = await axiosClient.delete(`/admin/user/${User_Id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Delete user ${User_Id} error:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 4. Xem lịch sử đăng nhập của một User bất kỳ (Admin view)
export const fetchUserLoginHistoryByAdmin = async (userId) => {
  try {
    const response = await axiosClient.get(`/admin/login-history/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Fetch history for user ${userId} error:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};
