import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRealtimeData } from "../src/hooks/useRealtimeData";
import { useSmartAlert } from "../src/hooks/useSmartAlerts";
import { useNotification } from "../src/services/useNotification";

export default function RootLayout() {
  useRealtimeData();   // Firebase data
  useSmartAlert();     // ALERT ENGINE
  useNotification();   // permission setup

  return <Stack screenOptions={{ headerShown: false }} />;
}