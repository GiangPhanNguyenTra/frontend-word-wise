import ADHD from "@/assets/images/mbti.svg";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function MBTICard() {
  return (
    <View className="flex-row items-center bg-[#AEE8E4] rounded-2xl p-4 mb-4">
      {/* Bên trái: Tiêu đề và nút */}
      <View className="flex-1">
        <Text className="text-black text-lg font-[Poppins-SemiBold] mb-3">
          ADHD
        </Text>
        <TouchableOpacity
          className="bg-[#2DA800] px-6 py-2 rounded-full max-w-[80px] items-center"
          onPress={() => router.push("/(tabs)/explore/test")}
        >
          <Text className="text-white font-[Poppins-SemiBold]">Test</Text>
        </TouchableOpacity>
      </View>

      {/* Bên phải: Hình ảnh */}
      <ADHD width={100} height={80} />
    </View>
  );
}
