import axiosClient from "./apiClient";

// 1. User: Tạo một ticket mới (kèm tin nhắn đầu tiên)
export const createTicketApi = async (subject, initialMessage) => {
  try {
    const response = await axiosClient.post("/feedback/tickets", {
      subject: subject,
      initial_message: initialMessage,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Create ticket error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 2. Cả Admin/User: Gửi thêm tin nhắn vào Ticket đã có
export const sendMessageApi = async (ticketId, content) => {
  try {
    const response = await axiosClient.post(
      `/feedback/tickets/${ticketId}/messages`,
      {
        message_content: content,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Send message error:", error.response?.data || error.message);
    throw error;
  }
};

// 3. Cả Admin/User: Lấy chi tiết toàn bộ tin nhắn trong 1 Ticket
export const fetchTicketDetailsApi = async (ticketId) => {
  try {
    const response = await axiosClient.get(`/feedback/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Fetch ticket details error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 4. User: Xem danh sách các phản hồi của mình
export const fetchMyTicketsApi = async () => {
  return (await axiosClient.get("/feedback/my-tickets")).data;
};

// 5. Admin: Xem tất cả yêu cầu hỗ trợ
export const fetchAllTicketsAdminApi = async () => {
  return (await axiosClient.get("/feedback/admin/all-tickets")).data;
};
//6.Admin/User: Update trạng thái của ticket
export const updateTicketStatusApi = async (ticketId, newStatus) => {
  try {
    const response = await axiosClient.patch(
      `/feedback/tickets/${ticketId}/status`,
      null,
      {
        params: { new_status: newStatus },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update ticket status error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
