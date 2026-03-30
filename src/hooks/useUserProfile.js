import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUserProfile = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserProfile phải được dùng trong UserProvider");
  }
  return context;
};
