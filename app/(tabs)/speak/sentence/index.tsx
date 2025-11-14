import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PracticeSentencePage() {
    const handleSelect = (count: number) => {
        router.push({
            pathname: "/(tabs)/speak/sentence/practice",
            params: { count: count.toString() },
        });
    };

    return(
        <View className="flex-1 bg-[#F6F6F6]">
            <Heading title="Practice Sentences" onBack={() => router.replace('/(tabs)/speak')} />

            <ScrollView>
                <View className="mt-4 px-6 items-center justify-center">
                    <Text className="font-[Montserrat-Bold] text-xl mb-6 text-center">
                        Select the number of sentences {"\n"} to practice.
                    </Text>

                    {[1, 2, 3, 4].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handleSelect(num)}
                            className="w-full bg-white p-6 rounded-[57px] mb-6 mx-4 shadow-lg items-center"
                        >
                            <Text className="text-3xl font-[Montserrat-SemiBold] text-[#2563EB]">
                                {num}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}