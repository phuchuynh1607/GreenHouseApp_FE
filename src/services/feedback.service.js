import axiosClient from "./apiClient";

// create ticket
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

// send message
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

//get ticket detail
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

// user: get my ticket
export const fetchMyTicketsApi = async () => {
  return (await axiosClient.get("/feedback/my-tickets")).data;
};

// admin: get all ticket
export const fetchAllTicketsAdminApi = async () => {
  return (await axiosClient.get("/feedback/admin/all-tickets")).data;
};
//update ticket status
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
