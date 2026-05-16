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
  const [currentTicket, setCurrentTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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
      console.error("Fetch tickets erro:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getTicketDetails = async (ticketId) => {
    try {
      const data = await fetchTicketDetailsApi(ticketId);
      setCurrentTicket(data);
      return data;
    } catch (err) {
      console.error("Get ticket details error:", err);
    }
  };

  const handleCreateTicket = async (subject, message) => {
    try {
      const newTicket = await createTicketApi(subject, message);
      await getMyTickets();
      return newTicket;
    } catch (err) {
      throw err;
    }
  };

  const sendNewMessage = async (ticketId, content) => {
    try {
      await sendMessageApi(ticketId, content);
      await getTicketDetails(ticketId);
    } catch (err) {
      console.error("Send message error:", err);
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
      console.error("Update ticket status error:", err);
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
