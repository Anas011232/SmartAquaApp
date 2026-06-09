import { View, Text, StyleSheet } from "react-native";
import { useAquaStore } from "../../src/store/aquaStore";
import { useAquaRealtime } from "../../src/hooks/useRealtimeData";

export default function Dashboard() {
  useAquaRealtime();

  const { temp, ph, pumpStatus, minTemp, maxTemp, minPH, maxPH } =
    useAquaStore();

  const tempOk = temp >= minTemp && temp <= maxTemp;
  const phOk = ph >= minPH && ph <= maxPH;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌊 Smart Aqua Care</Text>

      <View style={styles.card}>
        <Text>🌡 Temperature</Text>
        <Text style={{ fontSize: 22 }}>{temp}°C</Text>
        <Text>{tempOk ? "✅ Normal" : "⚠️ Out of Range"}</Text>
      </View>

      <View style={styles.card}>
        <Text>⚗️ pH Level</Text>
        <Text style={{ fontSize: 22 }}>{ph}</Text>
        <Text>{phOk ? "✅ Normal" : "⚠️ Out of Range"}</Text>
      </View>

      <View style={styles.card}>
        <Text>🚰 Pump Status</Text>
        <Text style={{ fontSize: 22 }}>{pumpStatus}</Text>
      </View>

      <View style={styles.card}>
        <Text>📊 Safe Range</Text>
        <Text>Temp: {minTemp} - {maxTemp} °C</Text>
        <Text>pH: {minPH} - {maxPH}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0f172a" },
  title: { fontSize: 24, color: "white", marginBottom: 20 },
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
});