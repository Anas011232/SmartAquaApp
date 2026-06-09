import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, db } from "../../src/services/firebase";
import { useRouter } from "expo-router";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ref, set } from "firebase/database";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: "YOUR_EXPO_CLIENT_ID",
//   });

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

//   const googleLogin = async () => {
//     const result = await promptAsync();

//     if (result?.type === "success") {
//       const credential = GoogleAuthProvider.credential(
//         result.authentication.id_token
//       );

//       const userCred = await signInWithCredential(auth, credential);
//       const user = userCred.user;

//       // Save Google user if first time
//       await set(ref(db, "Users/" + user.uid), {
//         uid: user.uid,
//         name: user.displayName,
//         email: user.email,
//         photo: user.photoURL,
//         createdAt: Date.now(),
//       });

//       router.replace("/(tabs)/dashboard");
//     }
//   };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>🔐 Login</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={login} />
      {/* <Button title="Login with Google" onPress={googleLogin} /> */}

      <Text
        onPress={() => router.push("/(auth)/register")}
        style={{ marginTop: 10, color: "blue" }}
      >
        New user? Register here
      </Text>
    </View>
  );
}