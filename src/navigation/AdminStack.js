import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import các màn hình quản trị
import AdminScreen from "../screens/admin/AdminScreen";
import SystemThresholdScreen from "../screens/admin/SystemThresholdScreen";
import UsersListScreen from "../screens/admin/UserListScreen";
import UserDetailScreen from "../screens/admin/UserDetailScreen";
import AdminUserLoginHistoryScreen from "../screens/admin/AdminUserLoginHistoryScreen";
import AdminNotificationLogScreen from "../screens/admin/AdminNotificationLogScreen";
import AdminFeedbackListScreen from "../screens/admin/AdminFeedbackListScreen";
import AdminFeedbackDetailScreen from "../screens/admin/AdminFeedbackDetailScreen";

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminMain"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
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
      <Stack.Screen
        name="AdminNotificationLog"
        component={AdminNotificationLogScreen}
      />
      <Stack.Screen
        name="AdminFeedbackList"
        component={AdminFeedbackListScreen}
      />
      <Stack.Screen
        name="AdminFeedbackDetail"
        component={AdminFeedbackDetailScreen}
      />

      {/* 3. Luồng Quản lý hệ thống */}
      <Stack.Screen name="SystemThreshold" component={SystemThresholdScreen} />
    </Stack.Navigator>
  );
};

export default AdminStack;
