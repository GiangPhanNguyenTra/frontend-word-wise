import Heading from "@/components/Heading";
import React from "react";
import AngryIcon from "@/assets/images/angry.svg";
import { ScrollView, Text, View } from "react-native";

export default function DiaryListScreen() {
    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Diary" />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4 mt-4"
            >
                <View className="flex-1 w-full gap-6 px-4 items-center">
                    <Text className="text-[36px] text-center font-[Poppins-SemiBold]">24/09/2025</Text>
                    <Text className="text-[24px] text-center font-[Poppins-Regular]">19:00 AM</Text>
                    <AngryIcon width={100} height={100} />
                    <Text className="mt-1 text-[18px] font-[Poppins-Regular] text-[#736B66] text-center">
                        I felt really angry, and I am still learning asdasd
                        adsasdasdasdasdas
                        asdasdsadasdsadasdasdsadsadsadas
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}