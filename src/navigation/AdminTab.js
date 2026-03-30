import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AdminStack from "./AdminStack";

const Tab = createBottomTabNavigator();

const AdminTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2f6b3f",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "AdminControl") {
            iconName = focused
              ? "shield-checkmark"
              : "shield-checkmark-outline";
          }
          // Nếu sau này bạn mở lại Tab IoT
          else if (route.name === "IoT") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="AdminControl"
        component={AdminStack}
        options={{
          title: "Quản trị viên",
          tabBarHideOnKeyboard: true, // Ẩn tab khi hiện bàn phím (rất cần cho Admin)
        }}
      />

      {/* Thêm các Tab khác nếu cần sau này */}
    </Tab.Navigator>
  );
};

export default AdminTab;
