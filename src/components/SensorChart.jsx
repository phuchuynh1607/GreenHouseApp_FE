import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const SensorChart = ({ title, unit, color, chartData }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartLabel}>
        {title} ({unit})
      </Text>

      <LineChart
        data={chartData}
        width={screenWidth - 70}
        height={250}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          color: (opacity = 1) => color,
          labelColor: (opacity = 1) => `#666`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: color,
          },
        }}
        verticalLabelRotation={30}
        bezier
        style={styles.chartStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  chartLabel: { fontSize: 14, color: "#888", marginBottom: 10 },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
});

export default SensorChart;
