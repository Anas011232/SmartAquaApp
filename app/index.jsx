import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  SlideInLeft,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/firebase";
import {
  Thermometer,
  Zap,
  Bot,
  BarChart3,
  SlidersHorizontal,
  ChevronRight,
  Droplets,
  Wifi,
  Database,
  CircuitBoard,
  CheckCircle2,
  ArrowRight,
  Activity,
  Bell,
  Lock,
  X,
  Check,
} from "lucide-react-native";

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  deepNavy:    "#01304A",
  navy:        "#014F6E",
  brand:       "#0077B6",
  brandLight:  "#0096C7",
  aqua:        "#48CAE4",
  foam:        "#CAF0F8",
  foamDark:    "#ADE8F4",
  white:       "#FFFFFF",
  bgSoft:      "#F0F9FF",
  bgCard:      "#F8FAFC",
  border:      "#E2E8F0",
  textPrimary: "#0F172A",
  textSec:     "#334155",
  textMuted:   "#64748B",
  textFaint:   "#94A3B8",
  red:         "#EF4444",
  redBg:       "#FEE2E2",
  amber:       "#F59E0B",
  amberBg:     "#FEF3C7",
  green:       "#22C55E",
  greenBg:     "#DCFCE7",
  purple:      "#8B5CF6",
  purpleBg:    "#EDE9FE",
  cyan:        "#06B6D4",
  cyanBg:      "#CFFAFE",
  grayBg:      "#F1F5F9",
};

// Platform-aware card shadow
const SHADOW = Platform.select({
  ios: {
    shadowColor: "#01304A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: {
    elevation: 3,
  },
});

const SHADOW_SM = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  android: {
    elevation: 2,
  },
});

// ─────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────
const STATS = [
  { value: "99.9%", label: "Uptime" },
  { value: "5s",    label: "Sync Rate" },
  { value: "±0.01", label: "pH Precision" },
  { value: "24/7",  label: "AI Watch" },
];

const FEATURES = [
  { icon: Thermometer,     color: C.red,    bg: C.redBg,    title: "Precision Sensors",    desc: "Live pH & temperature from NodeMCU, streamed every 5s." },
  { icon: Zap,             color: C.amber,  bg: C.amberBg,  title: "Relay Automation",     desc: "Pump activates automatically when values breach thresholds." },
  { icon: Bot,             color: C.purple, bg: C.purpleBg, title: "AI Analytics",         desc: "ML models predict anomalies before they become emergencies." },
  { icon: BarChart3,       color: C.cyan,   bg: C.cyanBg,   title: "Historical Graphs",    desc: "Visualise trends over hours, days, or months." },
  { icon: Bell,            color: C.green,  bg: C.greenBg,  title: "Push Alerts",          desc: "Instant notifications the moment parameters deviate." },
  { icon: SlidersHorizontal, color: C.textMuted, bg: C.grayBg, title: "Custom Thresholds", desc: "Set per-tank safe ranges for any species in seconds." },
];

const WORKFLOW = [
  { icon: CircuitBoard, tag: "SENSE",    title: "Hardware Reads",    desc: "NodeMCU sensors collect pH & temperature every 5 seconds." },
  { icon: Wifi,         tag: "TRANSMIT", title: "Cloud Sync",        desc: "Data pushes to Firebase Realtime Database over Wi-Fi." },
  { icon: Database,     tag: "COMPARE",  title: "Threshold Check",   desc: "Logic layer compares readings against your configured limits." },
  { icon: Zap,          tag: "ACT",      title: "Relay Triggered",   desc: "Firebase relay flag flips; pump activates within milliseconds." },
  { icon: CheckCircle2, tag: "RESTORE",  title: "Verified Recovery", desc: "System deactivates pump when safe levels return. Event logged." },
];

const VS = [
  { bad: "Check pH every few hours",   good: "Continuous 5-second readings" },
  { bad: "Missed anomalies overnight", good: "24/7 AI-powered watch" },
  { bad: "Manual pump switching",      good: "Automatic relay trigger" },
  { bad: "Paper or spreadsheet logs",  good: "Searchable cloud history" },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function SmartAquaLanding() {
  const router   = useRouter();
  const { width } = useWindowDimensions();
  const insets   = useSafeAreaInsets();
  const [user, setUser] = useState(null);

  const isTablet = width >= 768;
  const pad      = isTablet ? 40 : 20;

  // Pulsing live dot
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);
  const pulseAnim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity:   2.2 - pulse.value,
  }));

  // Firebase auth (display only — no redirect)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const goMain = () => router.push(user ? "/(tabs)/dashboard" : "/(auth)/login");

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.deepNavy} translucent={false} />

      {/* ── NAVBAR ──────────────────────────────── */}
      <SafeAreaView edges={["top"]} style={styles.navSafe}>
        <View style={[styles.nav, { paddingHorizontal: pad }]}>

          {/* Brand */}
          <View style={styles.navBrand}>
            <View style={styles.navIconWrap}>
              <Droplets color={C.aqua} size={18} strokeWidth={2.5} />
            </View>
            <Text style={styles.navLogo}>Smart Aqua</Text>
          </View>

          {/* Right side */}
          <View style={styles.navRight}>
            <View style={styles.liveChip}>
              <View style={styles.liveDotWrap}>
                <Animated.View style={[styles.liveDotRing, pulseAnim]} />
                <View style={styles.liveDotCore} />
              </View>
              <Text style={styles.liveLabel}>LIVE</Text>
            </View>

            <TouchableOpacity
              style={styles.navBtn}
              onPress={goMain}
              activeOpacity={0.75}
            >
              <Text style={styles.navBtnText}>{user ? "Dashboard" : "Log in"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >

        {/* ── HERO ──────────────────────────────── */}
        <View style={[styles.hero, { paddingHorizontal: pad }]}>
          {/* Decorative circles */}
          <View style={styles.heroBubble1} />
          <View style={styles.heroBubble2} />

          <Animated.View entering={FadeInDown.delay(80).duration(600)}>
            {/* Eyebrow badge */}
            <View style={styles.heroBadge}>
              <Activity color={C.aqua} size={12} strokeWidth={2.5} />
              <Text style={styles.heroBadgeText}>IoT-Powered Aquaculture</Text>
            </View>

            <Text style={[styles.heroH1, isTablet && { fontSize: 44, lineHeight: 50 }]}>
              Water Quality,{"\n"}
              <Text style={styles.heroH1Accent}>Under Control.</Text>
            </Text>

            <Text style={styles.heroSub}>
              Smart Aqua links NodeMCU hardware to Firebase — monitoring pH,
              temperature & dissolved oxygen 24/7, with automatic pump control
              and AI-driven health insights.
            </Text>

            {/* CTA Buttons */}
            <TouchableOpacity
              style={styles.heroPrimary}
              onPress={goMain}
              activeOpacity={0.85}
            >
              <Text style={styles.heroPrimaryText}>
                {user ? "Open Dashboard" : "Start Monitoring Free"}
              </Text>
              <ChevronRight color={C.white} size={18} strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondary}
              onPress={() => router.push("/(auth)/register")}
              activeOpacity={0.75}
            >
              <Text style={styles.heroSecondaryText}>Create an account →</Text>
            </TouchableOpacity>

            {/* Trust pills */}
            <View style={styles.trustRow}>
              {["No subscription", "Open hardware", "Your data"].map((t) => (
                <View key={t} style={styles.trustPill}>
                  <CheckCircle2 color={C.aqua} size={11} strokeWidth={2.5} />
                  <Text style={styles.trustText}>{t}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* ── STATS ─────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={[styles.statsBar, { paddingHorizontal: pad }]}
        >
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < STATS.length - 1 && <View style={styles.statDiv} />}
            </React.Fragment>
          ))}
        </Animated.View>

        {/* ── PROBLEM VS SOLUTION ───────────────── */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={[styles.section, { paddingHorizontal: pad }]}
        >
          <Eyebrow label="Why Smart Aqua" />
          <Text style={styles.sectionH}>
            Manual care leaves gaps.{"\n"}
            <Text style={{ color: C.brand }}>We close them.</Text>
          </Text>

          {/* VS Cards */}
          <View style={styles.vsWrap}>
            {/* Manual */}
            <View style={[styles.vsCard, styles.vsCardBad, SHADOW_SM]}>
              <Text style={styles.vsCardHead}>⚠ Manual Care</Text>
              {VS.map((v) => (
                <View key={v.bad} style={styles.vsRow}>
                  <View style={styles.vsDotBad} />
                  <Text style={styles.vsRowTextBad}>{v.bad}</Text>
                </View>
              ))}
            </View>

            {/* Smart */}
            <View style={[styles.vsCard, styles.vsCardGood, SHADOW]}>
              <Text style={styles.vsCardHeadGood}>✦ Smart Aqua</Text>
              {VS.map((v) => (
                <View key={v.good} style={styles.vsRow}>
                  <View style={styles.vsDotGood} />
                  <Text style={styles.vsRowTextGood}>{v.good}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ── FEATURES ──────────────────────────── */}
        <View style={[styles.sectionAlt, { paddingHorizontal: pad }]}>
          <Eyebrow label="Platform Capabilities" />
          <Text style={styles.sectionH}>Every tool your{"\n"}aquarium needs.</Text>
          <Text style={styles.sectionSub}>
            Purpose-built for IoT precision — not a generic sensor app.
          </Text>

          <View style={[
            styles.featGrid,
            isTablet && { flexDirection: "row", flexWrap: "wrap" }
          ]}>
            {FEATURES.map((f, i) => (
              <Animated.View
                key={f.title}
                entering={SlideInLeft.delay(i * 60).duration(400)}
                style={[
                  styles.featCard,
                  SHADOW_SM,
                  isTablet && { width: "48%", marginRight: i % 2 === 0 ? "4%" : 0 },
                ]}
              >
                <View style={[styles.featIconBox, { backgroundColor: f.bg }]}>
                  <f.icon color={f.color} size={20} strokeWidth={2} />
                </View>
                <Text style={styles.featTitle}>{f.title}</Text>
                <Text style={styles.featDesc}>{f.desc}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* ── WORKFLOW ──────────────────────────── */}
        <View style={[styles.section, { paddingHorizontal: pad }]}>
          <Eyebrow label="System Architecture" />
          <Text style={styles.sectionH}>From sensor to action.</Text>
          <Text style={styles.sectionSub}>
            Five deterministic steps — hardware to cloud to relay.
          </Text>

          <View style={styles.flowList}>
            {WORKFLOW.map((step, i) => (
              <WorkflowStep
                key={step.title}
                step={step}
                index={i}
                isLast={i === WORKFLOW.length - 1}
              />
            ))}
          </View>
        </View>

        {/* ── SECURITY STRIP ────────────────────── */}
        <View style={[styles.secStrip, { paddingHorizontal: pad }]}>
          <View style={styles.secIconWrap}>
            <Lock color={C.aqua} size={24} strokeWidth={1.8} />
          </View>
          <View style={styles.secText}>
            <Text style={styles.secTitle}>Your data stays with you.</Text>
            <Text style={styles.secDesc}>
              Firebase Auth + Realtime DB — end-to-end encrypted. No third-party
              server ever touches your sensor readings.
            </Text>
          </View>
        </View>

        {/* ── FINAL CTA ─────────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={[styles.ctaSection, { paddingHorizontal: pad }]}
        >
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>
              Ready to monitor smarter?
            </Text>
            <Text style={styles.ctaSub}>
              Connect your NodeMCU, set your thresholds, and let Smart Aqua
              handle the rest — around the clock.
            </Text>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={goMain}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>
                {user ? "Back to Dashboard" : "Get Started Free"}
              </Text>
              <ArrowRight color={C.white} size={17} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── FOOTER ────────────────────────────── */}
        <View style={[styles.footer, { paddingHorizontal: pad }]}>
          <View style={styles.footerBrand}>
            <Droplets color={C.aqua} size={16} strokeWidth={2} />
            <Text style={styles.footerName}>Smart Aqua Care</Text>
          </View>
          <Text style={styles.footerSub}>Built for modern aquaculture · IoT + AI</Text>
          <Text style={styles.footerCopy}>© 2026 Smart Aqua Inc. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function Eyebrow({ label }) {
  return (
    <View style={eb.row}>
      <View style={eb.dot} />
      <Text style={eb.text}>{label.toUpperCase()}</Text>
    </View>
  );
}
const eb = StyleSheet.create({
  row:  { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: C.brand, marginRight: 8 },
  text: { fontSize: 11, fontWeight: "700", color: C.brand, letterSpacing: 1.6 },
});

function WorkflowStep({ step, index, isLast }) {
  const Icon = step.icon;
  return (
    <View style={fl.row}>
      {/* Spine */}
      <View style={fl.spine}>
        <View style={fl.circle}>
          <Icon color={C.white} size={15} strokeWidth={2} />
        </View>
        {!isLast && <View style={fl.line} />}
      </View>
      {/* Content */}
      <View style={[fl.content, isLast && { paddingBottom: 0 }]}>
        <View style={fl.meta}>
          <View style={fl.tag}>
            <Text style={fl.tagText}>{step.tag}</Text>
          </View>
          <Text style={fl.title}>{step.title}</Text>
        </View>
        <Text style={fl.desc}>{step.desc}</Text>
      </View>
    </View>
  );
}
const fl = StyleSheet.create({
  row:     { flexDirection: "row", alignItems: "flex-start" },
  spine:   { width: 38, alignItems: "center", flexShrink: 0 },
  circle:  { width: 38, height: 38, borderRadius: 19, backgroundColor: C.brand, justifyContent: "center", alignItems: "center", zIndex: 1 },
  line:    { width: 2, flex: 1, minHeight: 28, backgroundColor: C.border, marginTop: 3 },
  content: { flex: 1, paddingBottom: 28, paddingLeft: 14 },
  meta:    { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  tag:     { backgroundColor: C.foam, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  tagText: { fontSize: 10, fontWeight: "700", color: C.brand, letterSpacing: 0.8 },
  title:   { fontSize: 15, fontWeight: "700", color: C.textPrimary },
  desc:    { fontSize: 13, color: C.textMuted, lineHeight: 20 },
});

// ─────────────────────────────────────────────
// STYLESHEET
// ─────────────────────────────────────────────
const styles = StyleSheet.create({

  root:    { flex: 1, backgroundColor: C.deepNavy },
  scroll:  { flex: 1, backgroundColor: C.white },

  // NAV
  navSafe: { backgroundColor: C.deepNavy },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: C.deepNavy,
  },
  navBrand:   { flexDirection: "row", alignItems: "center" },
  navIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "rgba(72,202,228,0.15)",
    justifyContent: "center", alignItems: "center",
    marginRight: 8,
  },
  navLogo:  { fontSize: 16, fontWeight: "700", color: C.white, letterSpacing: 0.2 },
  navRight: { flexDirection: "row", alignItems: "center" },
  liveChip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(72,202,228,0.1)",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: "rgba(72,202,228,0.22)",
    marginRight: 10,
  },
  liveDotWrap: { width: 12, height: 12, justifyContent: "center", alignItems: "center", marginRight: 5 },
  liveDotRing: { position: "absolute", width: 12, height: 12, borderRadius: 6, backgroundColor: C.aqua, opacity: 0.35 },
  liveDotCore: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.aqua },
  liveLabel:   { fontSize: 10, fontWeight: "700", color: C.aqua, letterSpacing: 1.2 },
  navBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.16)",
  },
  navBtnText: { fontSize: 13, fontWeight: "600", color: C.white },

  // HERO
  hero: {
    backgroundColor: C.deepNavy,
    paddingTop: 40,
    paddingBottom: 52,
    overflow: "hidden",
  },
  heroBubble1: {
    position: "absolute", width: 280, height: 280, borderRadius: 140,
    backgroundColor: "rgba(0,119,182,0.18)",
    top: -80, right: -80,
  },
  heroBubble2: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(72,202,228,0.08)",
    bottom: 20, left: -50,
  },
  heroBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(72,202,228,0.1)",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: "rgba(72,202,228,0.25)",
    alignSelf: "flex-start", marginBottom: 20,
  },
  heroBadgeText: { fontSize: 11, fontWeight: "600", color: C.aqua, marginLeft: 6, letterSpacing: 0.4 },
  heroH1: {
    fontSize: 34, fontWeight: "800", color: C.white,
    lineHeight: 40, marginBottom: 16,
    letterSpacing: -0.5,
  },
  heroH1Accent: { color: C.aqua },
  heroSub: {
    fontSize: 14, color: "rgba(255,255,255,0.62)",
    lineHeight: 22, marginBottom: 30,
  },
  heroPrimary: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: C.brand,
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 24,
    marginBottom: 12,
    ...Platform.select({
      ios:     { shadowColor: C.brand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  heroPrimaryText: { fontSize: 15, fontWeight: "700", color: C.white, marginRight: 6 },
  heroSecondary: {
    alignItems: "center", paddingVertical: 13,
    borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)",
    marginBottom: 24,
  },
  heroSecondaryText: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.7)" },
  trustRow: { flexDirection: "row", flexWrap: "wrap" },
  trustPill: {
    flexDirection: "row", alignItems: "center",
    marginRight: 14, marginBottom: 6,
  },
  trustText: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 4 },

  // STATS
  statsBar: {
    flexDirection: "row",
    backgroundColor: C.deepNavy,
    paddingVertical: 22,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem:  { alignItems: "center", flex: 1 },
  statValue: { fontSize: 22, fontWeight: "800", color: C.aqua, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, textAlign: "center" },
  statDiv:   { width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.08)" },

  // SECTIONS
  section:    { paddingVertical: 48, backgroundColor: C.white },
  sectionAlt: { paddingVertical: 48, backgroundColor: C.bgSoft },
  sectionH: {
    fontSize: 26, fontWeight: "800", color: C.textPrimary,
    lineHeight: 32, marginBottom: 10, letterSpacing: -0.3,
  },
  sectionSub: { fontSize: 14, color: C.textMuted, lineHeight: 21, marginBottom: 28 },

  // VS
  vsWrap: { marginTop: 4 },
  vsCard: { borderRadius: 16, padding: 18, marginBottom: 12 },
  vsCardBad: {
    backgroundColor: C.bgCard,
    borderWidth: 1, borderColor: C.border,
  },
  vsCardGood: { backgroundColor: C.deepNavy },
  vsCardHead:     { fontSize: 14, fontWeight: "700", color: C.textSec,  marginBottom: 14 },
  vsCardHeadGood: { fontSize: 14, fontWeight: "700", color: C.aqua,     marginBottom: 14 },
  vsRow:          { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  vsDotBad:       { width: 7, height: 7, borderRadius: 4, backgroundColor: C.red,  marginRight: 10, flexShrink: 0 },
  vsDotGood:      { width: 7, height: 7, borderRadius: 4, backgroundColor: C.aqua, marginRight: 10, flexShrink: 0 },
  vsRowTextBad:   { fontSize: 13, color: C.textMuted, flex: 1 },
  vsRowTextGood:  { fontSize: 13, color: "rgba(255,255,255,0.78)", flex: 1 },

  // FEATURES
  featGrid:    { marginTop: 4 },
  featCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  featIconBox: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  featTitle: { fontSize: 14, fontWeight: "700", color: C.textPrimary, marginBottom: 5 },
  featDesc:  { fontSize: 13, color: C.textMuted, lineHeight: 20 },

  // WORKFLOW
  flowList: { marginTop: 8 },

  // SECURITY
  secStrip: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "#001828",
    paddingVertical: 28,
  },
  secIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "rgba(72,202,228,0.12)",
    justifyContent: "center", alignItems: "center",
    marginRight: 16, flexShrink: 0,
  },
  secText:  { flex: 1 },
  secTitle: { fontSize: 15, fontWeight: "700", color: C.white, marginBottom: 5 },
  secDesc:  { fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 20 },

  // CTA
  ctaSection: { backgroundColor: C.bgSoft, paddingVertical: 48 },
  ctaCard: {
    backgroundColor: C.white,
    borderRadius: 20, padding: 28,
    borderWidth: 1, borderColor: C.border,
    alignItems: "center",
    ...Platform.select({
      ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16 },
      android: { elevation: 3 },
    }),
  },
  ctaTitle: {
    fontSize: 22, fontWeight: "800", color: C.textPrimary,
    textAlign: "center", marginBottom: 10, letterSpacing: -0.3,
  },
  ctaSub: {
    fontSize: 14, color: C.textMuted, textAlign: "center",
    lineHeight: 21, marginBottom: 24,
  },
  ctaBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.brand, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 28,
    ...Platform.select({
      ios:     { shadowColor: C.brand, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  ctaBtnText: { fontSize: 15, fontWeight: "700", color: C.white, marginRight: 8 },

  // FOOTER
  footer: {
    backgroundColor: C.deepNavy,
    paddingVertical: 32,
    alignItems: "center",
  },
  footerBrand: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  footerName:  { fontSize: 14, fontWeight: "700", color: C.white, marginLeft: 7 },
  footerSub:   { fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 5, textAlign: "center" },
  footerCopy:  { fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" },
});