import ADHD from "@/assets/images/pss.svg";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function PSSCard() {
  return (
    <View className="flex-row items-center bg-[#D9D8FF] rounded-2xl p-4 mb-4">
      {/* Bên trái: Hình ảnh */}
      <ADHD width={100} height={80} />
      {/* Bên phải: Tiêu đề và nút */}
      <View className="flex-1 items-end">
        <Text className="text-black text-lg font-[Poppins-SemiBold] mb-3">
          PSS
        </Text>
        <TouchableOpacity
          className="bg-[#8130C8] px-6 py-2 rounded-full max-w-[80px] items-center"
          onPress={() => router.push("/(tabs)/explore/test")}
        >
          <Text className="text-white font-[Poppins-SemiBold]">Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
