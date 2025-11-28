import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface TrendData {
  day: string;
  score: number;
}

interface Props {
  data: TrendData[];
  color?: string;
}

export default function StatisticChart({ data, color = "#2563EB" }: Props) {
  const screenWidth = Dimensions.get("window").width;

  if (!data || data.length === 0) {
    return (
      <View className="h-[200px] items-center justify-center bg-white rounded-2xl">
        <Text className="text-gray-400 font-[Montserrat-Medium]">
          No data available
        </Text>
      </View>
    );
  }

  const labels = data.map((d) => d.day);
  const values = data.map((d) => d.score);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm items-center">
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth - 32} // full width minus padding
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
          color: (opacity = 1) => color,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#fff",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}
