import { View, Text } from "react-native";
import { auth } from "../../src/services/firebase";

export default function Profile() {
  const user = auth.currentUser;

  return (
    <View style={{ padding:20 }}>
      <Text>{user?.displayName}</Text>
      <Text>{user?.email}</Text>
    </View>
  );
}