import ADHD from "@/assets/images/gad.svg";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function GADCard() {
  return (
    <View className="flex-row items-center bg-[#BEC8CF] rounded-2xl p-4 mb-4">
      {/* Bên trái: Tiêu đề và nút */}
      <View className="flex-1">
        <Text className="text-black text-lg font-[Poppins-SemiBold] mb-3">
          GAD-7
        </Text>
        <TouchableOpacity
          className="bg-[#01101C] px-6 py-2 rounded-full max-w-[80px] items-center"
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
