import { useEffect } from "react";
import { configureNotifications } from "./notificationService";

export function useNotification() {
  useEffect(() => {
    configureNotifications();
  }, []);
}