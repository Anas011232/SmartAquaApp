// import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import { useState } from "react";
// import { ref, set } from "firebase/database";
// import { db } from "../../src/services/firebase";
// import { useAquaStore } from "../../src/store/aquaStore";

// export default function Settings() {
//   const store = useAquaStore();

//   const [minTemp, setMinTemp] = useState(String(store.minTemp));
//   const [maxTemp, setMaxTemp] = useState(String(store.maxTemp));
//   const [minPH, setMinPH] = useState(String(store.minPH));
//   const [maxPH, setMaxPH] = useState(String(store.maxPH));

//   const save = async () => {
//     await set(ref(db, "/Settings"), {
//       minTemp: Number(minTemp),
//       maxTemp: Number(maxTemp),
//       minPH: Number(minPH),
//       maxPH: Number(maxPH),
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>⚙️ Settings</Text>

//       <TextInput style={styles.input} value={minTemp} onChangeText={setMinTemp} placeholder="Min Temp" />
//       <TextInput style={styles.input} value={maxTemp} onChangeText={setMaxTemp} placeholder="Max Temp" />
//       <TextInput style={styles.input} value={minPH} onChangeText={setMinPH} placeholder="Min pH" />
//       <TextInput style={styles.input} value={maxPH} onChangeText={setMaxPH} placeholder="Max pH" />

//       <Button title="Save Settings" onPress={save} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 22, marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
// });

import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../src/services/firebase";
import { useAquaStore } from "../../src/store/aquaStore";

export default function Settings() {
  const store = useAquaStore();

  const [minTemp, setMinTemp] = useState(String(store.minTemp));
  const [maxTemp, setMaxTemp] = useState(String(store.maxTemp));
  const [minPH, setMinPH]   = useState(String(store.minPH));
  const [maxPH, setMaxPH]   = useState(String(store.maxPH));
  const [saved, setSaved]   = useState(false);

  const save = async () => {
    await set(ref(db, "/Settings"), {
      minTemp: Number(minTemp),
      maxTemp: Number(maxTemp),
      minPH:   Number(minPH),
      maxPH:   Number(maxPH),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#090d16" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.titleDot} />
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* TEMPERATURE SECTION */}
        <Text style={styles.sectionLabel}>🌡  TEMPERATURE RANGE</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Min Temp</Text>
              <TextInput
                style={styles.input}
                value={minTemp}
                onChangeText={setMinTemp}
                placeholder="e.g. 24"
                placeholderTextColor="#334155"
                keyboardType="numeric"
                keyboardAppearance="dark"
              />
              <Text style={styles.unit}>°C</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Max Temp</Text>
              <TextInput
                style={styles.input}
                value={maxTemp}
                onChangeText={setMaxTemp}
                placeholder="e.g. 28"
                placeholderTextColor="#334155"
                keyboardType="numeric"
                keyboardAppearance="dark"
              />
              <Text style={styles.unit}>°C</Text>
            </View>
          </View>
        </View>

        {/* PH SECTION */}
        <Text style={styles.sectionLabel}>⚗  pH RANGE</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Min pH</Text>
              <TextInput
                style={styles.input}
                value={minPH}
                onChangeText={setMinPH}
                placeholder="e.g. 6.5"
                placeholderTextColor="#334155"
                keyboardType="numeric"
                keyboardAppearance="dark"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Max pH</Text>
              <TextInput
                style={styles.input}
                value={maxPH}
                onChangeText={setMaxPH}
                placeholder="e.g. 8.5"
                placeholderTextColor="#334155"
                keyboardType="numeric"
                keyboardAppearance="dark"
              />
            </View>
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
          onPress={save}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>
            {saved ? "✓  Saved!" : "Save Settings"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38bdf8",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e2e8f0",
    letterSpacing: 0.3,
  },

  // SECTION
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },

  // CARD
  card: {
    backgroundColor: "#111c33",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "rgba(56,189,248,0.12)",
    borderTopWidth: 1,
    borderTopColor: "rgba(56,189,248,0.2)",
    padding: 16,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  inputLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 0.5,
    borderColor: "rgba(148,163,184,0.15)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    paddingRight: 36,
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: "600",
  },
  unit: {
    position: "absolute",
    right: 12,
    bottom: 13,
    color: "#334155",
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    width: 0.5,
    height: 60,
    backgroundColor: "rgba(148,163,184,0.1)",
  },

  // SAVE BUTTON
  saveBtn: {
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnSuccess: {
    backgroundColor: "#16a34a",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});