import React, { useState, useEffect, useCallback } from "react";
import { FeedbackContext } from "../context/FeedbackContext";
import {
  fetchMyTicketsApi,
  createTicketApi,
  sendMessageApi,
  fetchTicketDetailsApi,
  updateTicketStatusApi,
  fetchAllTicketsAdminApi,
} from "../services/feedback.service";
import { useAuth } from "../hooks/useAuth";

export const FeedbackProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null); // Lưu ticket đang xem chi tiết
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 1. Lấy danh sách ticket (Tự động phân loại User/Admin)
  const getMyTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let data;
      if (user.role === "admin") {
        data = await fetchAllTicketsAdminApi();
      } else {
        data = await fetchMyTicketsApi();
      }
      setTickets(data);
    } catch (err) {
      console.error("Lỗi fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. Lấy chi tiết tin nhắn của một Ticket cụ thể
  const getTicketDetails = async (ticketId) => {
    try {
      const data = await fetchTicketDetailsApi(ticketId);
      setCurrentTicket(data);
      return data;
    } catch (err) {
      console.error("Lỗi fetch chi tiết ticket:", err);
    }
  };

  // 3. Tạo ticket mới
  const handleCreateTicket = async (subject, message) => {
    try {
      const newTicket = await createTicketApi(subject, message);
      await getMyTickets();
      return newTicket;
    } catch (err) {
      throw err;
    }
  };

  // 4. Gửi tin nhắn vào ticket đang mở
  const sendNewMessage = async (ticketId, content) => {
    try {
      await sendMessageApi(ticketId, content);
      // Cập nhật lại chi tiết ticket để hiện tin nhắn mới ngay lập tức
      await getTicketDetails(ticketId);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      throw err;
    }
  };
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await updateTicketStatusApi(ticketId, newStatus);
      await getMyTickets();
      if (currentTicket && currentTicket.id === ticketId) {
        await getTicketDetails(ticketId);
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      throw err;
    }
  };

  useEffect(() => {
    getMyTickets();
  }, [getMyTickets]);

  return (
    <FeedbackContext.Provider
      value={{
        tickets,
        currentTicket,
        loading,
        createTicket: handleCreateTicket,
        sendNewMessage,
        getTicketDetails,
        refreshTickets: getMyTickets,
        updateTicketStatus,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
