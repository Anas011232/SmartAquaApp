// import { View, Text, Dimensions, StyleSheet } from "react-native";
// import { LineChart } from "react-native-chart-kit";
// import { useEffect, useState } from "react";
// import { useAquaStore } from "../../src/store/aquaStore"; // আপনার স্টোর

// const { width } = Dimensions.get("window");

// export default function History() {
//   const { temp, minTemp, maxTemp } = useAquaStore();
//   const [dataPoints, setDataPoints] = useState([0, 0, 0, 0, 0, 0]);

//   // ২ সেকেন্ড পর পর নতুন ভ্যালু যোগ করা
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDataPoints((currentData) => {
//         const newData = [...currentData.slice(1), temp || 0];
//         return newData;
//       });
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [temp]);

//   // রেঞ্জ চেক করে রঙের লজিক (রেঞ্জের বাইরে গেলে লাল, ভিতরে থাকলে সবুজ)
//   const isOutOfRange = (val) => val < minTemp || val > maxTemp;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerTitle}>Temperature History</Text>
      
//       <LineChart
//         data={{
//           labels: ["", "", "", "", "", "Now"],
//           datasets: [{ data: dataPoints }],
//         }}
//         width={width - 40}
//         height={220}
//         chartConfig={{
//           backgroundColor: "#090d16",
//           backgroundGradientFrom: "#111c33",
//           backgroundGradientTo: "#111c33",
//           decimalPlaces: 1,
//           color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`, // গ্রাফ লাইন কালার
//           labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//           style: { borderRadius: 16 },
//         }}
//         bezier
//         style={styles.chart}
//       />
      
//       <Text style={styles.infoText}>Updates every 2 seconds</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#090d16", padding: 20, paddingTop: 60 },
//   headerTitle: { fontSize: 20, color: "#fff", fontWeight: "bold", marginBottom: 20 },
//   chart: { marginVertical: 8, borderRadius: 16 },
//   infoText: { color: "#64748b", textAlign: "center", marginTop: 10 }
// });

/**
 * History.jsx — Real-time Sensor History
 *
 * Visualizes live Temperature and pH data with:
 *   - react-native-chart-kit LineChart (dual charts)
 *   - 2-second interval sliding data window (from original starter code)
 *   - Dynamic line color based on safe-range status
 *   - Full visual consistency with Dashboard.jsx
 *
 * Required install:
 *   npx expo install react-native-chart-kit react-native-svg
 */

import { View, Text, StyleSheet, Dimensions, ScrollView, SafeAreaView, StatusBar, Animated } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useEffect, useState, useRef } from "react";
import { useAquaStore } from "../../src/store/aquaStore";
import { Ionicons } from "@expo/vector-icons";

// ─── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 40; // padding 20 each side
const CHART_HEIGHT = 200;
const MAX_POINTS = 8; // sliding window size
const INTERVAL_MS = 2000;

// ─── Design tokens (identical to Dashboard.jsx) ───────────────────────────────
const C = {
  bg: "#090d16",
  card: "#111c33",
  accent: "#38bdf8",
  accentGlow: "rgba(56,189,248,0.12)",
  ok: "#4ade80",
  okBg: "rgba(34,197,94,0.10)",
  okBorder: "rgba(34,197,94,0.30)",
  okBorderTop: "rgba(34,197,94,0.40)",
  warn: "#fbbf24",
  warnBg: "rgba(245,158,11,0.10)",
  warnBorder: "rgba(245,158,11,0.30)",
  warnBorderTop: "rgba(245,158,11,0.40)",
  text: "#f1f5f9",
  textSub: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  border: "rgba(56,189,248,0.12)",
  borderTop: "rgba(56,189,248,0.18)",
  divider: "rgba(148,163,184,0.08)",
  separator: "rgba(148,163,184,0.15)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const emptyWindow = () => Array(MAX_POINTS).fill(null);

/** Replace nulls with 0 for the chart renderer; keep nulls for logic checks */
const chartSafe = (arr) => arr.map((v) => (v == null ? 0 : v));

/** Last non-null value */
const lastReal = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] != null) return arr[i];
  }
  return null;
};

/** X-axis labels: blank except last two positions */
const makeLabels = (len) =>
  Array(len)
    .fill("")
    .map((_, i) => (i === len - 1 ? "Now" : i === len - 2 ? "-2s" : ""));

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * PulseDot — animated blinking indicator shown in the header while live
 */
function PulseDot() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.6, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.pulseDotWrapper}>
      <Animated.View style={[styles.pulseDotRing, { transform: [{ scale }], opacity }]} />
      <View style={styles.pulseDotCore} />
    </View>
  );
}

/**
 * StatBadge — shows current value with ok/warn color
 */
function StatBadge({ value, unit, ok }) {
  if (value == null) return <Text style={styles.badgeLoading}>—</Text>;
  return (
    <View style={[styles.badge, ok ? styles.badgeOk : styles.badgeWarn]}>
      <Text style={[styles.badgeText, { color: ok ? C.ok : C.warn }]}>
        {value}
        {unit}
      </Text>
    </View>
  );
}

/**
 * RangeBar — visual min/max range display
 */
function RangeBar({ label, icon, min, max, unit, current, ok }) {
  return (
    <View style={styles.rangeRow}>
      <View style={styles.rangeLeft}>
        <Text style={styles.rangeIcon}>{icon}</Text>
        <Text style={styles.rangeLabel}>{label}</Text>
      </View>
      <View style={styles.rangeRight}>
        <Text style={styles.rangeVal}>
          <Text style={styles.rangeAccent}>{min ?? "—"}</Text>
          {"  –  "}
          <Text style={styles.rangeAccent}>{max ?? "—"}</Text>
          {"  "}
          {unit}
        </Text>
        {current != null && (
          <View style={[styles.rangeChip, ok ? styles.chipOk : styles.chipWarn]}>
            <Text style={[styles.rangeChipText, { color: ok ? C.ok : C.warn }]}>
              {ok ? "✓ Normal" : "⚠ Out of range"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * ChartCard — a single sensor chart card
 */
function ChartCard({ title, icon, dataPoints, ok, currentValue, unit, min, max, labels }) {
  // Entrance animation
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 50, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Dynamic chart line color based on range status
  const lineColor = ok == null
    ? C.accent               // not enough data yet → default blue
    : ok
    ? C.ok                   // in range → green
    : C.warn;                // out of range → amber

  const lineColorFn = (opacity = 1) => {
    if (ok == null) return `rgba(56,189,248,${opacity})`;
    if (ok) return `rgba(74,222,128,${opacity})`;
    return `rgba(251,191,36,${opacity})`;
  };

  const cardBorderStyle = ok == null
    ? {}
    : ok
    ? { borderColor: C.okBorder, borderTopColor: C.okBorderTop }
    : { borderColor: C.warnBorder, borderTopColor: C.warnBorderTop };

  return (
    <Animated.View
      style={[styles.card, cardBorderStyle, { transform: [{ translateY }], opacity }]}
    >
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardIcon}>{icon}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <StatBadge value={currentValue} unit={unit} ok={ok} />
      </View>

      {/* Chart */}
      <LineChart
        data={{
          labels,
          datasets: [{ data: chartSafe(dataPoints), color: lineColorFn }],
        }}
        width={CHART_WIDTH - 32} // card has 16px padding each side
        height={CHART_HEIGHT}
        chartConfig={{
          backgroundColor: C.card,
          backgroundGradientFrom: C.card,
          backgroundGradientTo: "#0d1829",
          decimalPlaces: 1,
          color: lineColorFn,
          labelColor: () => C.textMuted,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: lineColor,
          },
          propsForBackgroundLines: {
            stroke: C.divider,
            strokeWidth: 0.5,
          },
          fillShadowGradientFrom: lineColor,
          fillShadowGradientTo: C.card,
          fillShadowGradientFromOpacity: 0.18,
          fillShadowGradientToOpacity: 0,
        }}
        bezier
        withShadow
        withInnerLines
        withOuterLines={false}
        style={styles.chart}
        fromZero={false}
      />

      {/* Range sub-row */}
      <View style={styles.cardFooter}>
        <View style={styles.cardFooterItem}>
          <Text style={styles.footerLabel}>MIN</Text>
          <Text style={[styles.footerValue, { color: C.accent }]}>{min ?? "—"}</Text>
        </View>
        <View style={styles.cardFooterDivider} />
        <View style={styles.cardFooterItem}>
          <Text style={styles.footerLabel}>SAFE RANGE</Text>
          <Text style={styles.footerValue}>
            <Text style={{ color: C.accent }}>{min ?? "—"}</Text>
            {"  –  "}
            <Text style={{ color: C.accent }}>{max ?? "—"}</Text>
            {"  "}{unit}
          </Text>
        </View>
        <View style={styles.cardFooterDivider} />
        <View style={styles.cardFooterItem}>
          <Text style={styles.footerLabel}>MAX</Text>
          <Text style={[styles.footerValue, { color: C.accent }]}>{max ?? "—"}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function History() {
  // ── Store values (same as Dashboard) ──
  const { temp, ph, minTemp, maxTemp, minPH, maxPH } = useAquaStore();

  // ── Sliding data windows (from original starter — logic preserved) ──
  const [tempPoints, setTempPoints] = useState(emptyWindow);
  const [phPoints, setPhPoints] = useState(emptyWindow);

  // ── 2-second interval (from original starter — interval logic preserved) ──
  useEffect(() => {
    const interval = setInterval(() => {
      setTempPoints((cur) => [...cur.slice(1), temp ?? null]);
      setPhPoints((cur) => [...cur.slice(1), ph ?? null]);
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [temp, ph]);

  // ── Range checks (same logic as Dashboard's tempOk / phOk) ──
  const currentTemp = lastReal(tempPoints);
  const currentPh = lastReal(phPoints);

  const tempOk =
    currentTemp != null && minTemp != null && maxTemp != null
      ? currentTemp >= minTemp && currentTemp <= maxTemp
      : null;

  const phOk =
    currentPh != null && minPH != null && maxPH != null
      ? currentPh >= minPH && currentPh <= maxPH
      : null;

  const labels = makeLabels(MAX_POINTS);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <View style={styles.titleDot} />
              <Text style={styles.title}>Smart Aqua Care</Text>
            </View>
            <Text style={styles.subtitle}>Live Sensor History</Text>
          </View>
          <View style={styles.headerRight}>
            <PulseDot />
            <Text style={styles.liveLabel}>LIVE</Text>
          </View>
        </View>

        {/* ── Update cadence notice ── */}
        <View style={styles.noticeBar}>
          <Ionicons name="time-outline" size={13} color={C.textMuted} />
          <Text style={styles.noticeText}>Refreshing every 2 seconds · Last {MAX_POINTS * 2}s window</Text>
        </View>

        {/* ── Temperature chart ── */}
        <ChartCard
          title="Temperature"
          icon="🌡"
          dataPoints={tempPoints}
          ok={tempOk}
          currentValue={currentTemp != null ? currentTemp.toFixed(1) : null}
          unit="°C"
          min={minTemp}
          max={maxTemp}
          labels={labels}
        />

        {/* ── pH chart ── */}
        <ChartCard
          title="pH Level"
          icon="⚗"
          dataPoints={phPoints}
          ok={phOk}
          currentValue={currentPh != null ? currentPh.toFixed(2) : null}
          unit=""
          min={minPH}
          max={maxPH}
          labels={labels}
        />

        {/* ── Safe range summary card ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardIcon}>📊</Text>
              <Text style={styles.cardTitle}>Safe Range Reference</Text>
            </View>
          </View>

          <RangeBar
            label="Temperature"
            icon="🌡"
            min={minTemp}
            max={maxTemp}
            unit="°C"
            current={currentTemp}
            ok={tempOk}
          />
          <View style={styles.divider} />
          <RangeBar
            label="pH Level"
            icon="⚗"
            min={minPH}
            max={maxPH}
            unit=""
            current={currentPh}
            ok={phOk}
          />
        </View>

        {/* ── Legend ── */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Chart Color Guide</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: C.ok }]} />
            <Text style={styles.legendText}>Within safe range</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: C.warn }]} />
            <Text style={styles.legendText}>Outside safe range</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: C.accent }]} />
            <Text style={styles.legendText}>Waiting for data</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  flex: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingTop: 52,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: C.separator,
  },
  headerLeft: { gap: 4 },
  headerRight: {
    alignItems: "center",
    gap: 6,
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
    backgroundColor: C.accent,
  },
  title: {
    fontSize: 18,
    color: C.textSub,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: C.textMuted,
    letterSpacing: 0.5,
    marginLeft: 16,
  },
  liveLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: C.ok,
  },

  // Pulse dot
  pulseDotWrapper: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.ok,
    position: "absolute",
  },
  pulseDotRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: C.ok,
    position: "absolute",
  },

  // Notice bar
  noticeBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.2,
  },

  // Card
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    borderTopWidth: 1,
    borderTopColor: C.borderTop,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardIcon: {
    fontSize: 14,
  },
  cardTitle: {
    color: C.textMuted,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Chart
  chart: {
    marginHorizontal: 16,
    borderRadius: 10,
  },

  // Card footer (min/range/max)
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
  },
  cardFooterItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  cardFooterDivider: {
    width: 0.5,
    height: 28,
    backgroundColor: C.divider,
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: C.textMuted,
    textTransform: "uppercase",
  },
  footerValue: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textSub,
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  badgeOk: {
    backgroundColor: C.okBg,
    borderColor: C.okBorder,
  },
  badgeWarn: {
    backgroundColor: C.warnBg,
    borderColor: C.warnBorder,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  badgeLoading: {
    fontSize: 18,
    color: C.textMuted,
    fontWeight: "600",
  },

  // Range card rows
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rangeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rangeIcon: { fontSize: 14 },
  rangeLabel: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: "500",
  },
  rangeRight: {
    alignItems: "flex-end",
    gap: 5,
  },
  rangeVal: {
    fontSize: 13,
    color: C.textSub,
    fontWeight: "500",
  },
  rangeAccent: {
    color: C.accent,
    fontWeight: "600",
  },
  rangeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  chipOk: {
    backgroundColor: C.okBg,
    borderColor: C.okBorder,
  },
  chipWarn: {
    backgroundColor: C.warnBg,
    borderColor: C.warnBorder,
  },
  rangeChipText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Divider
  divider: {
    height: 0.5,
    backgroundColor: C.divider,
    marginHorizontal: 16,
  },

  // Legend
  legendCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    borderTopWidth: 1,
    borderTopColor: C.borderTop,
    gap: 10,
  },
  legendTitle: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: C.textMuted,
    marginBottom: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    color: C.textSub,
    fontWeight: "500",
  },
});