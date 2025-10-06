import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangePassword() {
    const [old_password, setOldPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Change Password" />
            <View className="py-2 px-4 gap-4">
                {/* Old Password */}
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Montserrat-Regular]"
                    value={old_password}
                    onChangeText={setOldPassword}
                    placeholder="Old Password"
                    placeholderTextColor="#7B7B7B"
                />
                {/* New Password */}
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Montserrat-Regular]"
                    value={new_password}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    placeholderTextColor="#7B7B7B"
                />
                {/* Confirm Password */}
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Montserrat-Regular]"
                    value={confirm_password}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor="#7B7B7B"
                />
                <TouchableOpacity
                    disabled={!old_password || !new_password || !confirm_password}
                    className={`w-full h-14 rounded-xl items-center justify-center ${
              !old_password || !new_password || !confirm_password ? "opacity-40 bg-[#7F56D9]" : "bg-[#7F56D9]"
            }`}
                    onPress={() => router.push("/(tabs)/settings")}
                >
                   
                        <Text className="text-white text-base font-[Montserrat-Bold]">SAVE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}