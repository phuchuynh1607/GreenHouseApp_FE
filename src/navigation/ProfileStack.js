import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "../screens/profile/UserProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import LoginHistoryScreen from "../screens/profile/LoginHistoryScreen";
import CreateFeedbackScreen from "../screens/feedback/CreateFeedbackScreen";
import FeedbackHistoryScreen from "../screens/feedback/FeedbackHistoryScreen";
import FeedbackDetailScreen from "../screens/feedback/FeedbackDetailScreen";
import NotificationHistoryScreen from "../screens/profile/NotificationHistoryScreen";

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserProfileMain"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="UserProfileMain" component={UserProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="LoginHistory" component={LoginHistoryScreen} />
      <Stack.Screen
        name="NotificationsHistory"
        component={NotificationHistoryScreen}
      />
      <Stack.Screen name="CreateFeedback" component={CreateFeedbackScreen} />
      <Stack.Screen name="FeedbackHistory" component={FeedbackHistoryScreen} />
      <Stack.Screen name="FeedbackDetail" component={FeedbackDetailScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
