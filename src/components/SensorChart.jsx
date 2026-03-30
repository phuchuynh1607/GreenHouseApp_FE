import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const SensorChart = ({ title, data, unit, color }) => {
  // Nếu không có dữ liệu, tạo mảng rỗng hoặc dữ liệu mặc định để hiện trục
  const chartData = {
    labels: data?.labels || ["-", "-", "-", "-", "-"],
    datasets: [
      {
        data: data?.values || [0, 0, 0, 0, 0], // Hiện trục 0 nếu chưa có số liệu
        color: (opacity = 1) => color,
      },
    ],
  };

  return (
    <View style={styles.chartWrapper}>
      <Text style={styles.chartTitle}>
        {title} ({unit})
      </Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          color: (opacity = 1) => color,
          labelColor: (opacity = 1) => `#333`,
          style: { borderRadius: 16 },
          propsForDots: { r: "4", strokeWidth: "2", stroke: color },
        }}
        bezier // Đường cong mềm mại
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
};
