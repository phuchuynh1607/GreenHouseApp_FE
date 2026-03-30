import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Import các Provider
import { Providers as AuthProvider } from "./src/providers/auth_provider";
import { UserProvider } from "./src/providers/user_provider";
import { IotProvider } from "./src/providers/iot_provider";
import { FeedbackProvider } from "./src/providers/feedback_provider";
import { ThresholdProvider } from "./src/providers/threshold_provider";
import { AdminProvider } from "./src/providers/admin_provider";
import { useAuth } from "./src/hooks/useAuth";

// Import Navigation Stack
import AdminTab from "./src/navigation/AdminTab";
import MainTab from "./src/navigation/MainTab";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#2f6b3f" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.role === "admin" ? (
          <Stack.Screen name="Admin" component={AdminTab} />
        ) : (
          <Stack.Screen name="Main" component={MainTab} />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AdminProvider>
          <UserProvider>
            <IotProvider>
              <ThresholdProvider>
                <FeedbackProvider>
                  <NavigationContainer>
                    <RootNavigation />
                  </NavigationContainer>
                </FeedbackProvider>
              </ThresholdProvider>
            </IotProvider>
          </UserProvider>
        </AdminProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
