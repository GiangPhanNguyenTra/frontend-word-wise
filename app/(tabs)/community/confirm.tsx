import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmScreen() {
    return(
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title=""/>

            <ScrollView className="flex-1 px-4 gap-5 mt-4" contentContainerStyle={{flexGrow: 1, paddingBottom: 20 }}>
                <View className="flex-1 justify-between">
                    <View className="items-center gap-5 px-2">
                        <Text className="font-[Poppins-Bold] text-lg text-black">Public Policy</Text>
                        <Text className="text-base font-[Poppins-Regular] text-black">
                            Before posting, please make sure you are at least 13 years old. Your post must not contain links, phone numbers, or sensitive keywords (such as “kms” and similar terms). Please read and fully understand these rules before sharing any content.
                        </Text>
                    </View>
                </View>

                <View className="px-3">
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: "/(tabs)/community/add" })}
                        className="bg-[#7F56D9] h-16 rounded-xl items-center justify-center"
                    >
                        <Text className="text-white text-base font-[Poppins-Bold]">Agree</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}