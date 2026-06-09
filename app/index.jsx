import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/firebase";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  // 🔄 Loading UI
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ❌ Not logged in → login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ Logged in → dashboard
  return <Redirect href="/(tabs)/dashboard" />;
}