import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangeAccount() {
    const [username, setUsername] = useState<string>("");

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Change Account" />
            <View className="py-2 px-4 gap-1">
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Poppins-Regular]"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="user1234567"
                    placeholderTextColor="#7B7B7B"
                    maxLength={30}
                />
                <Text className="self-stretch text-right text-xs text-gray-400 font-[Poppins-Regular]">
                    0/30
                </Text>
                <TouchableOpacity
                    disabled={!username}
                    className={`w-full h-14 rounded-xl items-center justify-center ${
                        !username ? "opacity-40 bg-[#7F56D9]" : "bg-[#7F56D9]"
                        }`}                     
                    onPress={() => router.push("/(tabs)/settings")}
                >
                    <Text className="text-white text-base font-[Poppins-Bold]">SAVE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}