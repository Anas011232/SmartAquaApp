import { useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import { sendLocalNotification } from "../services/notificationService";

export function useSmartAlerts() {
  const lastAlert = useRef({ temp: false, ph: false });

  useEffect(() => {
    const currentRef = ref(db, "/Current");
    const settingsRef = ref(db, "/Settings");

    let current = null;
    let settings = null;

    const check = () => {
      if (!current || !settings) return;

      const temp = current?.Temp;
      const ph = current?.pH;

      const minT = settings?.minTemp;
      const maxT = settings?.maxTemp;
      const minP = settings?.minPH;
      const maxP = settings?.maxPH;

      if (
        temp === undefined ||
        ph === undefined ||
        minT === undefined ||
        maxT === undefined ||
        minP === undefined ||
        maxP === undefined
      ) return;

      // 🌡️ TEMP CHECK
      const tempOut = temp < minT || temp > maxT;

      if (tempOut && !lastAlert.current.temp) {
        sendLocalNotification(
          "🌡️ Temperature Alert",
          `Temperature out of range: ${temp}`
        );
        lastAlert.current.temp = true;
      }

      if (!tempOut) lastAlert.current.temp = false;

      // 🧪 PH CHECK
      const phOut = ph < minP || ph > maxP;

      if (phOut && !lastAlert.current.ph) {
        sendLocalNotification(
          "🧪 pH Alert",
          `pH out of range: ${ph}`
        );
        lastAlert.current.ph = true;
      }

      if (!phOut) lastAlert.current.ph = false;
    };

    const unsub1 = onValue(currentRef, (snap) => {
      current = snap.val();
      check();
    });

    const unsub2 = onValue(settingsRef, (snap) => {
      settings = snap.val();
      check();
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);
}