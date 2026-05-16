import { useContext } from "react";
import { ThresholdContext } from "../context/ThresholdContext";

export const useThreshold = () => {
  const context = useContext(ThresholdContext);
  if (!context) {
    throw new Error("useThreshold must be used within ThresholdProvider");
  }
  return context;
};
