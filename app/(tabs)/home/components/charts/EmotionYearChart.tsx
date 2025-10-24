import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const emotions = ["Angry", "Worried", "Neutral", "Happy", "Excited"];

const EmotionYearChart = () => {
  const [selected, setSelected] = useState<{
    month: string;
    value: number;
  } | null>(null);

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const data = [2, 3, 4, 5, 3, 2, 1, 4, 5, 3, 2, 4];

  return (
    <View className="bg-white rounded-2xl p-4 shadow mt-6">
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 40}
        height={250}
        fromZero
        yAxisInterval={1}
        formatYLabel={(value) => emotions[Math.round(Number(value)) - 1] ?? ""}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: () => "#2563EB",
          strokeWidth: 1.5,
          labelColor: () => "#9E9E9E",
          propsForLabels: {
            fontFamily: "Montserrat-Regular",
            fontSize: 10,
          },
          fillShadowGradientFrom: "#2563EB",
          fillShadowGradientTo: "#FFFFFF",
          fillShadowGradientFromOpacity: 0.3,
          fillShadowGradientToOpacity: 0,
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#2563EB",
            fill: "#FFFFFF",
          },
          propsForBackgroundLines: {
            stroke: "#EDEDED",
          },
        }}
        bezier
        style={{ borderRadius: 16 }}
        decorator={() =>
          selected ? (
            <View
              style={{
                position: "absolute",
                top: 20,
                left:
                  labels.indexOf(selected.month) *
                    ((screenWidth - 40) / labels.length) -
                  20,
                backgroundColor: "#2563EB",
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {selected.month}: {emotions[selected.value - 1]}
              </Text>
            </View>
          ) : null
        }
        onDataPointClick={(point) => {
          setSelected({
            month: labels[point.index],
            value: data[point.index],
          });
        }}
      />
    </View>
  );
};

export default EmotionYearChart;
