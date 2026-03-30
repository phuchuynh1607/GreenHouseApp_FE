import { useContext } from "react";
import { ThresholdContext } from "../context/ThresholdContext";

export const useThreshold = () => {
  const context = useContext(ThresholdContext);
  if (!context) {
    throw new Error("useIoT phải được dùng trong ThresholdProvider");
  }
  return context;
};
