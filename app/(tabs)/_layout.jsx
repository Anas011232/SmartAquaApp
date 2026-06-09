import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0ea5e9",
        tabBarStyle: {
          backgroundColor: "#0f172a",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: "Dashboard" }}
      />

      <Tabs.Screen
        name="settings"
        options={{ title: "Settings" }}
      />

      <Tabs.Screen
        name="notifications"
        options={{ title: "Alerts" }}
      />

      <Tabs.Screen
        name="history"
        options={{ title: "History" }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}