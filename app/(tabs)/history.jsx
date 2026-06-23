import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import { useAquaStore } from "../../src/store/aquaStore"; // আপনার স্টোর

const { width } = Dimensions.get("window");

export default function History() {
  const { temp, minTemp, maxTemp } = useAquaStore();
  const [dataPoints, setDataPoints] = useState([0, 0, 0, 0, 0, 0]);

  // ২ সেকেন্ড পর পর নতুন ভ্যালু যোগ করা
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((currentData) => {
        const newData = [...currentData.slice(1), temp || 0];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [temp]);

  // রেঞ্জ চেক করে রঙের লজিক (রেঞ্জের বাইরে গেলে লাল, ভিতরে থাকলে সবুজ)
  const isOutOfRange = (val) => val < minTemp || val > maxTemp;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Temperature History</Text>
      
      <LineChart
        data={{
          labels: ["", "", "", "", "", "Now"],
          datasets: [{ data: dataPoints }],
        }}
        width={width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#090d16",
          backgroundGradientFrom: "#111c33",
          backgroundGradientTo: "#111c33",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`, // গ্রাফ লাইন কালার
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={styles.chart}
      />
      
      <Text style={styles.infoText}>Updates every 2 seconds</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16", padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 20, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  chart: { marginVertical: 8, borderRadius: 16 },
  infoText: { color: "#64748b", textAlign: "center", marginTop: 10 }
});