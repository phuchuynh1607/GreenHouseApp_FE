import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import các màn hình quản trị
import AdminScreen from "../screens/admin/AdminScreen";
import SystemThresholdScreen from "../screens/admin/SystemThresholdScreen";
import UsersListScreen from "../screens/admin/UserListScreen";
import UserDetailScreen from "../screens/admin/UserDetailScreen";
import AdminUserLoginHistoryScreen from "../screens/admin/AdminUserLoginHistoryScreen";

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminMain"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // Hiệu ứng mượt mà khi chuyển màn hình
      }}
    >
      {/* 1. Màn hình Dashboard trung tâm của Admin */}
      <Stack.Screen name="AdminMain" component={AdminScreen} />

      {/* 2. Luồng Quản lý người dùng */}
      <Stack.Screen name="UserList" component={UsersListScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen
        name="UserLoginHistory"
        component={AdminUserLoginHistoryScreen}
      />

      {/* 3. Luồng Quản lý hệ thống */}
      <Stack.Screen name="SystemThreshold" component={SystemThresholdScreen} />
    </Stack.Navigator>
  );
};

export default AdminStack;
