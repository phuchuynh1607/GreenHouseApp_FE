import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import các màn hình thuộc nhánh IoT/Dashboard
import DashboardScreen from "../screens/iot/DashboardScreen";
import ThresholdSettingScreen from "../screens/iot/ThresholdSettingScreen";
import SensorHistoryScreen from "../screens/iot/SensorHistoryScreen";
const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="DashboardMain"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Màn hình chính hiển thị 4 cảm biến + Biểu đồ */}
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />

      {/* Màn hình cài đặt ngưỡng - Truy cập từ Dashboard */}
      <Stack.Screen
        name="ThresholdSettings"
        component={ThresholdSettingScreen}
      />
      {/*Màn hình hiển thị biểu đồ cho các loại cảm biến */}
      <Stack.Screen name="SensorHistory" component={SensorHistoryScreen} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
