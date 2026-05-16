import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen
        name="ThresholdSettings"
        component={ThresholdSettingScreen}
      />
      <Stack.Screen name="SensorHistory" component={SensorHistoryScreen} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
