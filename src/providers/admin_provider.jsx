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
  const [users, setUsers] = useState([]);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getUsers = useCallback(async () => {
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

  const getUserFullInfo = async (userId) => {
    setLoading(true);
    try {
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
        refreshUsers: getUsers,
        getUserDetail: getUserFullInfo,
        deleteUser: handleDeleteUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
