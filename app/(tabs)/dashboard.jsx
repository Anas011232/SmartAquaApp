

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

  const { temp, ph, pumpStatus, minTemp, maxTemp, minPH, maxPH } = useAquaStore();

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
        <View style={styles.titleRow}>
          <View style={styles.titleDot} />
          <Text style={styles.title}>Smart Aqua Care</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>⏻  Logout</Text>
        </Pressable>
      </View>

      {/* TEMP + PH GRID */}
      <View style={styles.grid}>
        {/* TEMP */}
        <View style={[styles.card, styles.cardHalf, tempOk === true && styles.cardOk, tempOk === false && styles.cardBad]}>
          <Text style={styles.label}>🌡  TEMPERATURE</Text>
          <Text style={styles.value}>{temp != null ? `${temp}°C` : "—"}</Text>
          {tempOk != null && (
            <View style={[styles.chip, tempOk ? styles.chipOk : styles.chipBad]}>
              <Text style={[styles.chipText, tempOk ? styles.chipTextOk : styles.chipTextBad]}>
                {tempOk ? "✓  Normal" : "⚠  Out of range"}
              </Text>
            </View>
          )}
        </View>

        {/* PH */}
        <View style={[styles.card, styles.cardHalf, phOk === true && styles.cardOk, phOk === false && styles.cardBad]}>
          <Text style={styles.label}>⚗  pH LEVEL</Text>
          <Text style={styles.value}>{ph != null ? ph : "—"}</Text>
          {phOk != null && (
            <View style={[styles.chip, phOk ? styles.chipOk : styles.chipBad]}>
              <Text style={[styles.chipText, phOk ? styles.chipTextOk : styles.chipTextBad]}>
                {phOk ? "✓  Normal" : "⚠  Out of range"}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* PUMP */}
      <View style={styles.card}>
        <Text style={styles.label}>🚰  PUMP STATUS</Text>
        <View style={styles.pumpRow}>
          <Text style={styles.pumpName}>{pumpStatus ?? "Loading..."}</Text>
          {/* {pumpStatus && (
            <View style={styles.pumpBadge}>
              <View style={styles.pumpDot} />
              <Text style={styles.pumpBadgeText}>Running</Text>
            </View>
          )} */}
        </View>
      </View>

      {/* SAFE RANGE */}
      <View style={styles.card}>
        <Text style={styles.label}>📊  SAFE RANGE</Text>

        <View style={styles.rangeRow}>
          <Text style={styles.rangeLabel}>🌡  Temperature</Text>
          <Text style={styles.rangeVal}>
            <Text style={styles.rangeAccent}>{minTemp ?? "—"}</Text>
            {" – "}
            <Text style={styles.rangeAccent}>{maxTemp ?? "—"}</Text>
            {"  °C"}
          </Text>
        </View>

        <View style={[styles.rangeRow, styles.rangeRowBorder]}>
          <Text style={styles.rangeLabel}>⚗  pH Level</Text>
          <Text style={styles.rangeVal}>
            <Text style={styles.rangeAccent}>{minPH ?? "—"}</Text>
            {" – "}
            <Text style={styles.rangeAccent}>{maxPH ?? "—"}</Text>
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 52,
    backgroundColor: "#090d16",
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(148,163,184,0.15)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38bdf8",
  },
  title: {
    fontSize: 18,
    color: "#e2e8f0",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  logoutBtn: {
    borderWidth: 0.5,
    borderColor: "rgba(148,163,184,0.3)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  logoutText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
  },

  // GRID
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  cardHalf: {
    flex: 1,
  },

  // CARDS
  card: {
    backgroundColor: "#111c33",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "rgba(56,189,248,0.12)",
    borderTopWidth: 1,
    borderTopColor: "rgba(56,189,248,0.18)",
  },
  cardOk: {
    borderColor: "rgba(34,197,94,0.25)",
    borderTopColor: "rgba(34,197,94,0.35)",
  },
  cardBad: {
    borderColor: "rgba(245,158,11,0.3)",
    borderTopColor: "rgba(245,158,11,0.4)",
  },

  // LABEL + VALUE
  label: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 22,
    color: "#f1f5f9",
    fontWeight: "700",
    lineHeight: 36,
    marginBottom: 10,
  },

  // STATUS CHIP
  chip: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  chipOk: {
    backgroundColor: "rgba(34,197,94,0.1)",
    borderColor: "rgba(34,197,94,0.3)",
  },
  chipBad: {
    backgroundColor: "rgba(245,158,11,0.1)",
    borderColor: "rgba(245,158,11,0.3)",
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  chipTextOk: { color: "#4ade80" },
  chipTextBad: { color: "#fbbf24" },

  // PUMP
  pumpRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pumpName: {
    fontSize: 18,
    color: "#e2e8f0",
    fontWeight: "600",
  },
  pumpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(34,197,94,0.1)",
    borderWidth: 0.5,
    borderColor: "rgba(34,197,94,0.3)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  pumpDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ade80",
  },
  pumpBadgeText: {
    color: "#4ade80",
    fontSize: 12,
    fontWeight: "600",
  },

  // RANGE
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  rangeRowBorder: {
    borderTopWidth: 0.5,
    borderTopColor: "rgba(148,163,184,0.08)",
  },
  rangeLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  rangeVal: {
    fontSize: 13,
    color: "#cbd5e1",
    fontWeight: "500",
  },
  rangeAccent: {
    color: "#38bdf8",
    fontWeight: "600",
  },
});