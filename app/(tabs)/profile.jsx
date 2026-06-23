// import { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { auth, db } from "../../src/services/firebase";
// import { ref, get } from "firebase/database";
// import { signOut } from "firebase/auth";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";

// // আগের ডিজাইন টোকেন ব্যবহার করা হয়েছে
// const COLORS = {
//   bg: "#0F0F14",
//   surface: "#1A1A24",
//   accent: "#7C6BFF",
//   text: "#F0EFF8",
//   textMuted: "#6B6B80",
//   error: "#FF6B6B",
// };

// export default function Profile() {
//   const router = useRouter();
//   const [userProfile, setUserProfile] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const userRef = ref(db, "Users/" + user.uid);
//         const snapshot = await get(userRef);
//         if (snapshot.exists()) {
//           setUserProfile(snapshot.val());
//         }
//       }
//     };
//     fetchUserData();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.replace("/(auth)/login"); // আপনার লগইন রাউট অনুযায়ী চেঞ্জ করুন
//     } catch (err) {
//       Alert.alert("Error", "Logout failed");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.title}>Profile</Text>

//         <View style={styles.card}>
//           <View style={styles.avatarContainer}>
//             {userProfile?.photo ? (
//               <Image source={{ uri: userProfile.photo }} style={styles.avatar} />
//             ) : (
//               <View style={styles.avatarPlaceholder}>
//                 <Ionicons name="person" size={50} color={COLORS.textMuted} />
//               </View>
//             )}
//           </View>

//           <Text style={styles.name}>{userProfile?.name || "User"}</Text>
//           <Text style={styles.email}>{userProfile?.email}</Text>
//         </View>

//         <View style={styles.infoCard}>
//           <InfoRow icon="call-outline" label="Phone" value={userProfile?.phone || "N/A"} />
//           <InfoRow icon="calendar-outline" label="Joined" value={new Date(userProfile?.createdAt).toLocaleDateString()} />
//         </View>

//         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
//           <Text style={styles.logoutText}>Sign Out</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// function InfoRow({ icon, label, value }) {
//   return (
//     <View style={styles.row}>
//       <Ionicons name={icon} size={20} color={COLORS.textMuted} />
//       <View style={styles.rowText}>
//         <Text style={styles.rowLabel}>{label}</Text>
//         <Text style={styles.rowValue}>{value}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.bg },
//   scrollContent: { padding: 24 },
//   title: { fontSize: 32, fontWeight: "800", color: COLORS.white, marginBottom: 24 },
//   card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 32, alignItems: "center", marginBottom: 20 },
//   avatarContainer: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, overflow: "hidden" },
//   avatar: { width: "100%", height: "100%" },
//   avatarPlaceholder: { width: "100%", height: "100%", backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" },
//   name: { fontSize: 22, fontWeight: "700", color: COLORS.white },
//   email: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
//   infoCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, gap: 20 },
//   row: { flexDirection: "row", alignItems: "center", gap: 16 },
//   rowText: { gap: 2 },
//   rowLabel: { fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase" },
//   rowValue: { fontSize: 15, color: COLORS.white, fontWeight: "600" },
//   logoutBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 40, padding: 16 },
//   logoutText: { color: COLORS.error, fontSize: 16, fontWeight: "600" },
// });

/**
 * Profile.jsx — Production-quality redesign
 * All business logic (Firebase Realtime DB fetch, signOut, navigation) preserved exactly.
 * UI/UX completely overhauled to match the Register screen's design system.
 *
 * No new dependencies — uses only:
 *   - react-native core (Animated, Platform, StyleSheet, etc.)
 *   - @expo/vector-icons/Ionicons (already in Expo SDK)
 *   - firebase (unchanged)
 *   - expo-router (unchanged)
 */

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../src/services/firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

// ─── Design tokens (matches Register screen) ─────────────────────────────────
const COLORS = {
  bg: "#0F0F14",
  surface: "#1A1A24",
  surfaceHigh: "#22223A",
  accent: "#7C6BFF",
  accentLight: "#A89BFF",
  accentGlow: "rgba(124,107,255,0.18)",
  text: "#F0EFF8",
  textMuted: "#6B6B80",
  textSub: "#9898B0",
  border: "#2A2A38",
  error: "#FF6B6B",
  errorBg: "rgba(255,107,107,0.10)",
  success: "#5EE8A0",
  white: "#FFFFFF",
};

const RADIUS = { sm: 10, md: 16, lg: 24, pill: 50 };
const SPACE = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

const { width } = Dimensions.get("window");

// ─── Skeleton loader bar ──────────────────────────────────────────────────────
function SkeletonBar({ width: w, height: h = 14, radius = 8, style }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={[
        { width: w, height: h, borderRadius: radius, backgroundColor: COLORS.surfaceHigh, opacity },
        style,
      ]}
    />
  );
}

// ─── Avatar with animated entrance ───────────────────────────────────────────
function ProfileAvatar({ photo, name }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <Animated.View style={[styles.avatarOuter, { transform: [{ scale }], opacity }]}>
      {/* Glowing ring */}
      <View style={styles.avatarRing}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarInitialsContainer}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Info row with icon, label, value ────────────────────────────────────────
function InfoRow({ icon, label, value, loading }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={18} color={COLORS.accentLight} />
      </View>
      <View style={styles.infoTextBlock}>
        <Text style={styles.infoLabel}>{label}</Text>
        {loading ? (
          <SkeletonBar width={120} height={13} style={{ marginTop: 4 }} />
        ) : (
          <Text style={styles.infoValue}>{value || "—"}</Text>
        )}
      </View>
    </View>
  );
}

// ─── Menu action row ──────────────────────────────────────────────────────────
function ActionRow({ icon, label, color, onPress, showChevron = true }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.actionRow}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.85}
      >
        <View style={[styles.actionIcon, { backgroundColor: color + "22" }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={[styles.actionLabel, { color: color === COLORS.error ? COLORS.error : COLORS.text }]}>
          {label}
        </Text>
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: "auto" }} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function Profile() {
  const router = useRouter();

  // ── Original state (unchanged) ──
  const [userProfile, setUserProfile] = useState(null);

  // ── UI-only state ──
  const [loading, setLoading] = useState(true);

  // ── Original useEffect (logic unchanged) ──
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(db, "Users/" + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  // ── Original handleLogout (logic unchanged) ──
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert("Error", "Logout failed");
    }
  };

  // Formatted join date
  const joinedDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Page header ── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageEyebrow}>Account</Text>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        {/* ── Hero card: avatar + name + email ── */}
        <View style={styles.heroCard}>
          {/* Accent glow behind avatar */}
          <View style={styles.heroGlow} />

          <ProfileAvatar photo={userProfile?.photo} name={userProfile?.name} />

          <View style={styles.heroMeta}>
            {loading ? (
              <>
                <SkeletonBar width={160} height={22} radius={10} style={{ marginBottom: 8 }} />
                <SkeletonBar width={120} height={14} radius={8} />
              </>
            ) : (
              <>
                <Text style={styles.heroName}>{userProfile?.name || "User"}</Text>
                <Text style={styles.heroEmail}>{userProfile?.email}</Text>
              </>
            )}
          </View>

          {/* Accent pill badge */}
          <View style={styles.heroBadge}>
            <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
            <Text style={styles.heroBadgeText}>Verified</Text>
          </View>
        </View>

        {/* ── Info card ── */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>Details</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon="call-outline"
            label="Phone"
            value={userProfile?.phone}
            loading={loading}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="calendar-outline"
            label="Member since"
            value={joinedDate}
            loading={loading}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="mail-outline"
            label="Email"
            value={userProfile?.email}
            loading={loading}
          />
        </View>

        {/* ── Actions card ── */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>Settings</Text>
        </View>

        <View style={styles.actionsCard}>
          <ActionRow
            icon="person-outline"
            label="Edit Profile"
            color={COLORS.accent}
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <ActionRow
            icon="notifications-outline"
            label="Notifications"
            color={COLORS.accentLight}
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <ActionRow
            icon="shield-checkmark-outline"
            label="Privacy & Security"
            color={COLORS.success}
            onPress={() => {}}
          />
        </View>

        {/* ── Logout ── */}
        <View style={styles.logoutSection}>
          <ActionRow
            icon="log-out-outline"
            label="Sign Out"
            color={COLORS.error}
            onPress={handleLogout}
            showChevron={false}
          />
        </View>

        {/* Bottom breathing room */}
        <View style={{ height: SPACE.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.xl,
  },

  // Page header
  pageHeader: {
    marginBottom: SPACE.xl,
  },
  pageEyebrow: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.accent,
    marginBottom: SPACE.xs,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  // Hero card
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACE.xl,
    alignItems: "center",
    marginBottom: SPACE.md,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: { elevation: 10 },
    }),
  },
  heroGlow: {
    position: "absolute",
    top: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accentGlow,
  },
  heroMeta: {
    alignItems: "center",
    marginTop: SPACE.md,
  },
  heroName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  heroEmail: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: SPACE.xs,
    textAlign: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: SPACE.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: 6,
    backgroundColor: "rgba(94,232,160,0.12)",
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(94,232,160,0.25)",
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.success,
    letterSpacing: 0.3,
  },

  // Avatar
  avatarOuter: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.pill,
    borderWidth: 2.5,
    borderColor: COLORS.accent,
    padding: 3,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.pill,
  },
  avatarInitialsContainer: {
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.accentGlow,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.accentLight,
    letterSpacing: 1,
  },

  // Section label
  sectionLabel: {
    marginBottom: SPACE.sm,
    marginTop: SPACE.xs,
  },
  sectionLabelText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLORS.textMuted,
  },

  // Info card
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACE.xs,
    marginBottom: SPACE.lg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.md,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.md,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentGlow,
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 3,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACE.lg,
  },

  // Actions card
  actionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACE.xs,
    marginBottom: SPACE.lg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.md,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.md,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Logout section
  logoutSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACE.xs,
    borderWidth: 1,
    borderColor: COLORS.errorBg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
});