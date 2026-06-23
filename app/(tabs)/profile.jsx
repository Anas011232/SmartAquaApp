// import { View, Text } from "react-native";
// import { auth } from "../../src/services/firebase";

// export default function Profile() {
//   const user = auth.currentUser;

//   return (
//     <View style={{ padding:20 }}>
//       <Text>{user?.displayName}</Text>
//       <Text>{user?.email}</Text>
//     </View>
//   );
// }

import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../src/services/firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

// আগের ডিজাইন টোকেন ব্যবহার করা হয়েছে
const COLORS = {
  bg: "#0F0F14",
  surface: "#1A1A24",
  accent: "#7C6BFF",
  text: "#F0EFF8",
  textMuted: "#6B6B80",
  error: "#FF6B6B",
};

export default function Profile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);

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
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login"); // আপনার লগইন রাউট অনুযায়ী চেঞ্জ করুন
    } catch (err) {
      Alert.alert("Error", "Logout failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            {userProfile?.photo ? (
              <Image source={{ uri: userProfile.photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color={COLORS.textMuted} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{userProfile?.name || "User"}</Text>
          <Text style={styles.email}>{userProfile?.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="call-outline" label="Phone" value={userProfile?.phone || "N/A"} />
          <InfoRow icon="calendar-outline" label="Joined" value={new Date(userProfile?.createdAt).toLocaleDateString()} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={COLORS.textMuted} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 24 },
  title: { fontSize: 32, fontWeight: "800", color: COLORS.white, marginBottom: 24 },
  card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 32, alignItems: "center", marginBottom: 20 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, overflow: "hidden" },
  avatar: { width: "100%", height: "100%" },
  avatarPlaceholder: { width: "100%", height: "100%", backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 22, fontWeight: "700", color: COLORS.white },
  email: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, gap: 20 },
  row: { flexDirection: "row", alignItems: "center", gap: 16 },
  rowText: { gap: 2 },
  rowLabel: { fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase" },
  rowValue: { fontSize: 15, color: COLORS.white, fontWeight: "600" },
  logoutBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 40, padding: 16 },
  logoutText: { color: COLORS.error, fontSize: 16, fontWeight: "600" },
});