
import { useEffect, useRef } from "react";
import { useAquaStore } from "../store/aquaStore";
import { sendLocalNotification } from "../services/notificationService";

export function useSmartAlert() {
  const { temp, ph, pumpStatus, minTemp, maxTemp, minPH, maxPH } =
    useAquaStore();

  const lastAlert = useRef({
    temp: false,
    ph: false,
    pump: "INIT",
  });

  useEffect(() => {
    if (
      temp == null ||
      ph == null ||
      minTemp == null ||
      maxTemp == null ||
      minPH == null ||
      maxPH == null
    )
      return;

    // 🌡 TEMP CHECK
    const tempOut = temp < minTemp || temp > maxTemp;

    if (tempOut && !lastAlert.current.temp) {
      sendLocalNotification(
        "🌡️ Temperature Alert",
        `Temp out of range: ${temp}`
      );
      lastAlert.current.temp = true;
    }

    if (!tempOut) lastAlert.current.temp = false;

    // 🧪 PH CHECK
    const phOut = ph < minPH || ph > maxPH;

    if (phOut && !lastAlert.current.ph) {
      sendLocalNotification(
        "🧪 pH Alert",
        `pH out of range: ${ph}`
      );
      lastAlert.current.ph = true;
    }

    if (!phOut) lastAlert.current.ph = false;

    // 💧 PUMP STATE CHANGE ONLY
    if (lastAlert.current.pump !== pumpStatus) {
      if (pumpStatus === "ON") {
        sendLocalNotification(
          "⚠️ Pump Activated",
          "Water out of range. Pump started."
        );
      }

      if (pumpStatus === "OFF") {
        sendLocalNotification(
          "✅ Pump Stopped",
          "Water quality restored."
        );
      }

      lastAlert.current.pump = pumpStatus;
    }
  }, [temp, ph, pumpStatus, minTemp, maxTemp, minPH, maxPH]);
}