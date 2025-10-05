// components/CircularProgress.tsx
import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  size?: number;
  strokeWidth?: number;
  percentage: number; // 0-100
  color?: string;
  bgColor?: string;
}

const CircularProgress = ({
  size = 60,
  strokeWidth = 8,
  percentage,
  color = "#2F80ED",
  bgColor = "#CDE9FB",
}: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size}>
        {/* Vòng nền */}
        <Circle
          stroke={bgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Vòng tiến trình */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={{ position: "absolute", fontWeight: "bold", color: "#555" }}>
        {percentage}%
      </Text>
    </View>
  );
};

export default CircularProgress;
