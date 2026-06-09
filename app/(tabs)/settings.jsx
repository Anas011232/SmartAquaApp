import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../src/services/firebase";
import { useAquaStore } from "../../src/store/aquaStore";

export default function Settings() {
  const store = useAquaStore();

  const [minTemp, setMinTemp] = useState(String(store.minTemp));
  const [maxTemp, setMaxTemp] = useState(String(store.maxTemp));
  const [minPH, setMinPH] = useState(String(store.minPH));
  const [maxPH, setMaxPH] = useState(String(store.maxPH));

  const save = async () => {
    await set(ref(db, "/Settings"), {
      minTemp: Number(minTemp),
      maxTemp: Number(maxTemp),
      minPH: Number(minPH),
      maxPH: Number(maxPH),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <TextInput style={styles.input} value={minTemp} onChangeText={setMinTemp} placeholder="Min Temp" />
      <TextInput style={styles.input} value={maxTemp} onChangeText={setMaxTemp} placeholder="Max Temp" />
      <TextInput style={styles.input} value={minPH} onChangeText={setMinPH} placeholder="Min pH" />
      <TextInput style={styles.input} value={maxPH} onChangeText={setMaxPH} placeholder="Max pH" />

      <Button title="Save Settings" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});