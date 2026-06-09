import { useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import { useAquaStore } from "../store/aquaStore";

export const useAquaRealtime = () => {
  const setStore = useAquaStore((s) => s.setStore);

  useEffect(() => {
    const currentRef = ref(db, "/Current");
    const settingsRef = ref(db, "/Settings");

    const unsub1 = onValue(currentRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      setStore({
        temp: data.Temp ?? 0,
        ph: data.pH ?? 0,
        pumpStatus: data.PumpStatus ?? "OFF",
      });
    });

    const unsub2 = onValue(settingsRef, (snap) => {
      const data = snap.val();
      if (!data) return;

      setStore({
        minTemp: data.minTemp,
        maxTemp: data.maxTemp,
        minPH: data.minPH,
        maxPH: data.maxPH,
      });
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);
};