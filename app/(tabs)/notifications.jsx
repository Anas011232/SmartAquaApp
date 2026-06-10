import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ref, onValue, off } from "firebase/database";
import { db } from "../../src/services/firebase";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const notificationRef = ref(db, "/Notifications");

    onValue(notificationRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setItems([]);
        return;
      }

      const list = Object.entries(data)
        .map(([id, message]) => ({
          id,
          message,
        }))
        .reverse();

      setItems(list);
    });

    return () => off(notificationRef);
  }, []);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 15,
            borderBottomWidth: 1,
          }}
        >
          <Text>{item.message}</Text>
        </View>
      )}
    />
  );
}