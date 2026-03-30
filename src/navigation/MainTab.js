import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardStack from "./DashboardStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2f6b3f",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === "IoT" ? "stats-chart" : "person-circle";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="IoT"
        component={DashboardStack}
        options={{ title: "Giám sát" }}
      />
      <Tab.Screen
        name="About Me"
        component={ProfileStack}
        options={{ title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
