import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const SensorHistoryScreen = ({ route, navigation }) => {
  // Nhận type từ Dashboard (ví dụ: 'temp', 'light', 'soil', 'humi')
  const { type } = route.params || { type: "temp" };

  const historyData = useMemo(() => {
    return {
      labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
      datasets: [
        {
          data: [25, 27, 30, 32, 29, 26], // Nếu không có data, hãy để [0]
          color: (opacity = 1) => `rgba(66, 146, 87, ${opacity})`, // Màu chủ đạo
          strokeWidth: 3,
        },
      ],
    };
  }, [type]);

  // Cấu hình UI theo loại cảm biến
  const config = {
    temp: { title: "Lịch sử Nhiệt độ", unit: "°C", color: "#FF6B6B" },
    light: { title: "Lịch sử Ánh sáng", unit: "%", color: "#FFD93D" },
    soil: { title: "Lịch sử Độ ẩm đất", unit: "%", color: "#4D96FF" },
    humi: { title: "Lịch sử Độ ẩm khí", unit: "%", color: "#6BCB77" },
  }[type];

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>
            Biểu đồ 24 giờ qua ({config.unit})
          </Text>

          <LineChart
            data={historyData}
            width={screenWidth - 40}
            height={250}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => config.color,
              labelColor: (opacity = 1) => `#666`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: config.color,
              },
            }}
            bezier // Tạo đường cong mượt mà
            style={styles.chartStyle}
          />
        </View>

        {/* Phần danh sách dữ liệu chi tiết dưới biểu đồ (tùy chọn) */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Thông số chi tiết</Text>
          <View style={styles.statRow}>
            <Text>Cao nhất:</Text>
            <Text style={styles.statValue}>32{config.unit}</Text>
          </View>
          <View style={styles.statRow}>
            <Text>Thấp nhất:</Text>
            <Text style={styles.statValue}>25{config.unit}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 45,
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#429257",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  content: { padding: 20 },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartLabel: { fontSize: 14, color: "#888", marginBottom: 10 },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
  statsContainer: { marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statValue: { fontWeight: "bold", color: "#333" },
});

export default SensorHistoryScreen;
