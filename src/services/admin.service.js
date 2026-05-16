import axiosClient from "./apiClient";
//Admin service

// 1. get all users
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
// 2. get user detail
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
//3. delete user
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

// 4. get user login history
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
