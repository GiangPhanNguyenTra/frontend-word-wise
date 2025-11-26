import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressCardProps = {
  percent: number;
  color: string;
  label?: string;
  icon?: React.ReactNode;
  compact?: boolean; // nếu true thì hiển thị dạng nhỏ (collection view)
};

export default function ProgressCard({
  percent,
  color,
  label,
  icon,
  compact = false,
}: ProgressCardProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayPercent, setDisplayPercent] = useState(0);

  const radius = 22;
  const strokeWidth = 6;
  const size = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percent,
      duration: 1200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) =>
      setDisplayPercent(Math.round(value))
    );
    return () => animatedValue.removeListener(listener);
  }, [percent]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return compact ? (
    <View className="items-center justify-center ">
      <Svg width={size} height={size}>
        <Circle
          stroke="#E5E7EB"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text className="absolute font-[Montserrat-Bold] text-xs">
        {displayPercent}%
      </Text>
    </View>
  ) : (
    // === Dạng đầy đủ cho HomeScreen ===
    <View
      className="w-[170px] bg-white rounded-2xl p-4 flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <View className="flex-1">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mb-2"
          style={{ backgroundColor: color }}
        >
          {icon}
        </View>
        <Text className="text-black font-[Montserrat-SemiBold] text-sm">
          {label}
        </Text>
      </View>

      <View className="items-center justify-center">
        <Svg width={size} height={size}>
          <Circle
            stroke="#E5E7EB"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Text className="absolute text-black font-[Montserrat-Bold] text-xs">
          {displayPercent}%
        </Text>
      </View>
    </View>
  );
}
