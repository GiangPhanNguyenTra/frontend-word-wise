import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Play } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SpeakScreen() {
    const practices = [
        {
            id: 1,
            label: "Practice Words",
            bg: "#FDF7E9",
            color: "#EBAD25",
            route: "/(tabs)/speak/word",
        },
        {
            id: 2,
            label: "Practice Sentences",
            bg: "#FDF7E9",
            color: "#EBAD25",
            route: "/",
        },
        { 
            id: 3,
            label: "Tips for Better Pronunciation",
            bg: "#E9EFFD",
            color: "#2563EB",
            route: "/(tabs)/speak/tips",
        },
    ];

    return(
        <View className="flex-1 bg-[#F6F6F6]">
            <Heading title="Speak" />
            <ScrollView>
                <View className="mt-4 px-6 items-center justify-center">
                    <Text className="font-[Montserrat-Bold] text-xl mb-2">
                        Pronunciation Practice
                    </Text>
                    <Text className="text-center font-[Montserrat-Medium] text-[#939393] mb-6">Practice words and sentences to improve your speaking skills.</Text>

                    {practices.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => router.push(item.route as any)}
                            className="w-full flex-row items-center justify-between rounded-[20px] p-4 mb-4 shadow-sm"
                            style={{
                                backgroundColor: item.bg,
                                shadowColor: "#000",
                                shadowOpacity: 0.05,
                                shadowOffset: { width: 0, height: 2 },
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <View className="flex-row items-center gap-4">
                                <Text className="text-base font-[Montserrat-Bold]">{item.label}</Text>
                            </View>
                            <View
                                className="rounded-full p-2"
                                style={{ backgroundColor: item.color }}
                            >
                                <Play size={18} color="white" fill="white" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}