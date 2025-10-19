"use client";

import Heading from "@/components/Heading";
import { router, useLocalSearchParams } from "expo-router";
import { Lightbulb, RotateCw } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResultScreen() {
    const { correct, total, accuracy } = useLocalSearchParams<{
        correct?: string;
        total?: string;
        accuracy?: string;
    }>();

    const acc = Number(accuracy) || 0;

    const getAdvice = (acc: number) => {
        if (acc >= 90)
        return {
            title: "Excellent!",
            message: "You sound almost like a native speaker! Keep practicing daily 💪",
            color: "#16A34A",
        };
        if (acc >= 70)
        return {
            title: "Good job!",
            message: "You're improving fast! Try focusing on pronunciation details 🎯",
            color: "#2563EB",
        };
        if (acc >= 50)
        return {
            title: "Not bad!",
            message: "You’re getting there — repeat and focus on vowel sounds 👂",
            color: "#EAB308",
        };
        return {
            title: "Keep trying!",
            message: "Don't give up! Practice speaking slowly and clearly 🗣️",
            color: "#DC2626",
        };
    };

    const advice = getAdvice(acc);
    const isGood = acc >= 70;

    return (
        <View className="flex-1 bg-[#F6F6F6]">
            <Heading title="Practice Results" />
            <ScrollView>
                <View className="flex shadow-lg mx-6 mb-6 gap-2 p-6 items-center justify-center bg-[#E9EFFD] rounded-[20px]">
                    <Text className=" text-lg text-[#2563EB] font-[Montserrat-ExtraBold]">Accuracy</Text>
                    <Text className="text-2xl text-[#EBAD25] font-[Montserrat-ExtraBold]">{acc}%</Text>
                    <Text className="text-xl font-[Montserrat-Bold]">Congratulations!</Text>
                    <Text className="text-xl font-[Montserrat-Bold] text-[#111] mb-2">
                        {isGood ? "You do the best! 🎉" : "You can do better next time!"}
                    </Text>
                </View>

                <View className="bg-white p-6 rounded-[32px] mb-8 shadow-lg ml-6 mr-6">
                    <View className="bg-[#E9EFFD] rounded-full w-10 h-10 items-center justify-center">
                        <Lightbulb color="#2563EB"/>
                    </View>
                    <Text className="text-lg mt-4 font-[Montserrat-Bold]">
                        {advice.message}
                    </Text>
                </View>

                <View className="w-full items-center mb-6">
                    <TouchableOpacity
                        onPress={() =>
                            router.replace({
                            pathname: "/(tabs)/speak/sentence/practice",
                            params: { count: total },
                            })
                        }
                        className="bg-[#2563EB] w-[200px] py-3 rounded-full mb-4 items-center justify-center flex-row gap-2"
                    >
                        <RotateCw size="20" color="white" />
                        <Text className="text-white text-center font-[Montserrat-Bold]">Retry</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)/speak/sentence")}
                        className="bg-white border border-[#2563EB] w-[200px] py-3 rounded-full"
                    >
                        <Text className="text-[#2563EB] text-center font-[Montserrat-Bold]">
                            Back to Selection Page
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}