import React, { useState, useEffect, useCallback } from "react";
import { AdminContext } from "../context/AdminContext";
import { useAuth } from "../hooks/useAuth";
import {
  fetchAllUsers,
  fetchUserDetailbyId,
  DeleteUserbyId,
  fetchUserLoginHistoryByAdmin,
} from "../services/admin.service";

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // Danh sách toàn bộ user
  const [selectedUserDetail, setSelectedUserDetail] = useState(null); // Chi tiết 1 user đang chọn
  const [selectedUserHistory, setSelectedUserHistory] = useState([]); // Lịch sử của user đang chọn
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 1. Hàm lấy danh sách tất cả user
  const getUsers = useCallback(async () => {
    // Chỉ fetch nếu user hiện tại là admin
    if (!user || user.role !== "admin") {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Fetch users list error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. Hàm lấy chi tiết và lịch sử của một user cụ thể
  const getUserFullInfo = async (userId) => {
    setLoading(true);
    try {
      // Gọi song song để tối ưu tốc độ
      const [detail, history] = await Promise.all([
        fetchUserDetailbyId(userId),
        fetchUserLoginHistoryByAdmin(userId),
      ]);
      setSelectedUserDetail(detail);
      setSelectedUserHistory(history);
      return { detail, history };
    } catch (err) {
      console.error(`Fetch info for user ${userId} error:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Hàm xóa user và cập nhật lại danh sách local ngay lập tức
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await DeleteUserbyId(userId);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      if (selectedUserDetail?.id === userId) {
        setSelectedUserDetail(null);
        setSelectedUserHistory([]);
      }

      return { success: true };
    } catch (err) {
      console.error("Delete user error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Tự động load danh sách khi vào luồng Admin
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <AdminContext.Provider
      value={{
        users,
        selectedUserDetail,
        selectedUserHistory,
        loading,
        refreshUsers: getUsers, // Gọi lại danh sách (ví dụ khi kéo để refresh)
        getUserDetail: getUserFullInfo, // Gọi khi nhấn vào 1 user trong list
        deleteUser: handleDeleteUser, // Gọi khi Admin nhấn nút xóa
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
