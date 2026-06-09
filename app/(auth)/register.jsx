import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../../src/services/firebase";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const register = async () => {
    if (password !== confirmPassword) {
      alert("Password mismatch");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // Firebase Auth profile update
      await updateProfile(user, {
        displayName: name,
        photoURL: image || "",
      });

      // Firebase Realtime DB save (IMPORTANT)
      await set(ref(db, "Users/" + user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        photo: image || "",
        createdAt: Date.now(),
      });

      router.replace("/(tabs)/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>📝 Register</Text>

      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#ccc",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Pick Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Register" onPress={register} />
    </View>
  );
}