import { useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import { useAquaStore } from "../store/aquaStore";

export function useRealtimeData() {
  const setStore = useAquaStore((s) => s.setStore);

  useEffect(() => {
    const currentRef = ref(db, "Current");
    const settingsRef = ref(db, "Settings");

    // ================= CURRENT DATA =================
    const unsubCurrent = onValue(currentRef, (snap) => {
      const data = snap.val();

      if (!data) return;

      setStore({
        temp: data.Temp ?? null,
        ph: data.pH ?? null,
        pumpStatus: data.PumpStatus ?? "OFF",
      });
    });

    // ================= SETTINGS DATA =================
    const unsubSettings = onValue(settingsRef, (snap) => {
      const data = snap.val();

      if (!data) return;

      setStore({
        minTemp: data.minTemp ?? null,
        maxTemp: data.maxTemp ?? null,
        minPH: data.minPH ?? null,
        maxPH: data.maxPH ?? null,
      });
    });

    // ================= CLEANUP =================
    return () => {
      unsubCurrent();
      unsubSettings();
    };
  }, []);
}