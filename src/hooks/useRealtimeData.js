import { useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import { useAquaStore } from "../store/aquaStore";

export function useRealtimeData() {
  const setStore = useAquaStore((s) => s.setStore);

  useEffect(() => {
    const currentRef = ref(db, "Current");
    const settingsRef = ref(db, "Settings");

    const unsub1 = onValue(currentRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      setStore({
        temp: Number(data.Temp),
        ph: Number(data.pH),
        pumpStatus: data.PumpStatus,
      });
    });

    const unsub2 = onValue(settingsRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      setStore({
        minTemp: Number(data.minTemp),
        maxTemp: Number(data.maxTemp),
        minPH: Number(data.minPH),
        maxPH: Number(data.maxPH),
      });
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);
}