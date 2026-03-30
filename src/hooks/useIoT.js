import { useContext } from "react";
import { IotContext } from "../context/IotContext";

export const useIoT = () => {
  const context = useContext(IotContext);
  if (!context) {
    throw new Error("useIoT phải được dùng trong IoTProvider");
  }
  return context;
};
