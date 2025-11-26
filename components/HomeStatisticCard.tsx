import React from "react";
import { Text, View } from "react-native";

type HomeStatisticCardProps = {
  color: string;
  value: string | number;
  label: string;
  icon: React.ReactNode;
};

export default function HomeStatisticCard({
  color,
  value,
  label,
  icon,
}: HomeStatisticCardProps) {
  return (
    <View
      className="w-full bg-white rounded-3xl p-4 flex-col justify-between h-[100px]"
      style={{
        shadowColor: color,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F3F4F6",
      }}
    >
      <View className="flex-row justify-between items-start">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </View>

        <Text
          className="font-[Montserrat-ExtraBold] text-3xl"
          style={{ color: color }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
      </View>

      <View>
        <Text className="text-gray-700 font-[Montserrat-SemiBold] text-xs uppercase tracking-wider">
          {label}
        </Text>
      </View>
    </View>
  );
}
