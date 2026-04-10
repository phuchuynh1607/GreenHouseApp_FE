import React, { useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useIoT } from "../../hooks/useIoT";
import SensorChart from "../../components/SensorChart";

const SensorHistoryScreen = ({ route, navigation }) => {
  const { type } = route.params || { type: "temp" };

  const { history, refreshHistory, loading } = useIoT();

  useEffect(() => {
    refreshHistory(24); // Lấy 24h qua
  }, [refreshHistory]);

  //  Chuyển đổi dữ liệu thực sang định dạng Chart
  const chartData = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        labels: ["-"],
        datasets: [{ data: [0] }],
      };
    }

    // Lấy nhãn thời gian (ví dụ: "14:30")
    // Chỉ hiển thị nhãn cách quãng để tránh đè chữ trên trục X
    const labels = history.map((item, index) => {
      if (history.length > 6) {
        return index % Math.floor(history.length / 5) === 0
          ? item.timestamp.split(" ")[0]
          : "";
      }
      return item.timestamp.split(" ")[0];
    });

    // Lấy giá trị theo type (temp, humi, light, soil)
    const values = history.map((item) => item[type] || 0);

    return {
      labels: labels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => config.color,
          strokeWidth: 3,
        },
      ],
    };
  }, [history, type]);

  // Tính toán số liệu Thống kê thực tế
  const stats = useMemo(() => {
    if (!history || history.length === 0) return { max: 0, min: 0 };
    const values = history.map((item) => item[type]);
    return {
      max: Math.max(...values).toFixed(1),
      min: Math.min(...values).toFixed(1),
    };
  }, [history, type]);

  const config = {
    temp: { title: "Lịch sử Nhiệt độ", unit: "°C", color: "#FF6B6B" },
    light: { title: "Lịch sử Ánh sáng", unit: "%", color: "#FFD93D" },
    soil: { title: "Lịch sử Độ ẩm đất", unit: "%", color: "#4D96FF" },
    humi: { title: "Lịch sử Độ ẩm khí", unit: "%", color: "#6BCB77" },
  }[type];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <TouchableOpacity onPress={() => refreshHistory(24)}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={config.color}
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            <SensorChart
              title={`Biểu đồ ${config.title}`}
              unit={config.unit}
              color={config.color}
              chartData={chartData}
            />
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Thông số chi tiết</Text>
              <View style={styles.statRow}>
                <Text>Cao nhất:</Text>
                <Text style={styles.statValue}>
                  {stats.max}
                  {config.unit}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text>Thấp nhất:</Text>
                <Text style={styles.statValue}>
                  {stats.min}
                  {config.unit}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text>Số lượng mẫu:</Text>
                <Text style={styles.statValue}>
                  {history?.length || 0} điểm
                </Text>
              </View>
            </View>
          </>
        )}
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
    padding: 20,
    backgroundColor: "#429257",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  content: { padding: 20 },
  statsContainer: { marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statValue: { fontWeight: "bold" },
});

export default SensorHistoryScreen;
