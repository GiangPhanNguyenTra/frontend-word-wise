import React from "react";
import { Text, View } from "react-native";

interface Props {
  data: { levelName: string; wordCount: number }[];
  totalWords: number;
}

export default function CollectionProgressChart({ data, totalWords }: Props) {
  // Tìm giá trị lớn nhất để scale chiều cao cột (tránh cột quá thấp hoặc quá cao)
  const maxCount = Math.max(...data.map((d) => d.wordCount), 1); // Ít nhất là 1 để tránh chia 0

  return (
    <View className="my-4">
      <View className="flex-row justify-between items-end h-[100px] px-2">
        {data.map((item, index) => {
          // Tính chiều cao % cho cột
          const heightPercent = (item.wordCount / maxCount) * 100;

          // Màu sắc gradient giả lập
          const colors = [
            "#FFC431",
            "#2563EB",
            "#FF1E00",
            "#41E2B2",
            "#8A8C03",
            "#D15743",
          ];
          const color = colors[index % colors.length];

          return (
            <View key={index} className="items-center flex-1">
              <Text className="text-[10px] text-gray-500 mb-1 font-bold">
                {item.wordCount}
              </Text>
              <View
                style={{
                  height: `${Math.max(heightPercent, 5)}%`, // Tối thiểu 5% để thấy cột
                  width: 12,
                  backgroundColor: color,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
            </View>
          );
        })}
      </View>

      {/* Labels dưới chân cột */}
      <View className="flex-row justify-between mt-2 px-2">
        {data.map((item, index) => (
          <View key={index} className="flex-1 items-center">
            <Text
              className="text-[8px] text-gray-400 font-[Montserrat-Medium] text-center"
              numberOfLines={1}
            >
              {item.levelName.replace("Level ", "L")}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
