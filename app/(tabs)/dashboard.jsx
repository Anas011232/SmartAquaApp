import { View, Text, StyleSheet, Pressable } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../src/services/firebase";
import { useAquaStore } from "../../src/store/aquaStore";
import { useRealtimeData } from "../../src/hooks/useRealtimeData";
import { useSmartAlert } from "../../src/hooks/useSmartAlerts";
import { useRouter } from "expo-router";

export default function Dashboard() {
  useRealtimeData();
  useSmartAlert();

  const router = useRouter();

  const {
    temp,
    ph,
    pumpStatus,
    minTemp,
    maxTemp,
    minPH,
    maxPH,
  } = useAquaStore();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const tempOk =
    temp != null && minTemp != null && maxTemp != null
      ? temp >= minTemp && temp <= maxTemp
      : null;

  const phOk =
    ph != null && minPH != null && maxPH != null
      ? ph >= minPH && ph <= maxPH
      : null;

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🌊 Smart Aqua Care</Text>

        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </Pressable>
      </View>

      {/* TEMP */}
      <View style={styles.card}>
        <Text style={styles.label}>🌡 Temperature</Text>
        <Text style={styles.value}>
          {temp != null ? `${temp}°C` : "Loading..."}
        </Text>
        {tempOk != null && (
          <Text style={[styles.status, tempOk ? styles.ok : styles.bad]}>
            {tempOk ? "✅ Normal" : "⚠️ Out of Range"}
          </Text>
        )}
      </View>

      {/* PH */}
      <View style={styles.card}>
        <Text style={styles.label}>⚗️ pH Level</Text>
        <Text style={styles.value}>
          {ph != null ? ph : "Loading..."}
        </Text>
        {phOk != null && (
          <Text style={[styles.status, phOk ? styles.ok : styles.bad]}>
            {phOk ? "✅ Normal" : "⚠️ Out of Range"}
          </Text>
        )}
      </View>

      {/* PUMP */}
      <View style={styles.card}>
        <Text style={styles.label}>🚰 Pump Status</Text>
        <Text style={styles.value}>
          {pumpStatus ?? "Loading..."}
        </Text>
      </View>

      {/* SETTINGS */}
      <View style={styles.card}>
        <Text style={styles.label}>📊 Safe Range</Text>

        <Text style={styles.small}>
          Temp: {minTemp ?? "-"} - {maxTemp ?? "-"} °C
        </Text>

        <Text style={styles.small}>
          pH: {minPH ?? "-"} - {maxPH ?? "-"}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0b1220",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#111c33",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2a44",
  },

  label: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 5,
  },

  value: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },

  status: {
    marginTop: 5,
    fontSize: 13,
  },

  ok: {
    color: "#22c55e",
  },

  bad: {
    color: "#f59e0b",
  },

  small: {
    color: "#94a3b8",
    fontSize: 13,
  },
});