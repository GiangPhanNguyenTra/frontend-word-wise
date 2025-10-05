import Heading from "@/components/Heading";
import { router } from "expo-router";
import { HandHeart, Heart, Radar, Rainbow, Sun, SunMoon } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import Minigame from "@/assets/images/minigame.svg";

export default function MinigameScreen() {
    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Minigame" />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4 pt-2"
            >
                <View className="w-full p-2 overflow-hidden">
                    <View className="flex-1 rounded-lg bg-[#FFFFFF] border border-[#EEEEEE] p-2 justify-center items-center overflow-hidden">
                        <View className="py-2 gap-2 items-center w-full">
                            <Minigame width={100} height={100} />
                            <Text className="text-lg font-[Poppins-Bold] text-center">
                                Build your mental habits
                            </Text>
                            <Text className="text-base font-[Poppins-Regular] text-center">
                                Overcome challenges to earn badges and improve your mental health
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Minigame 1 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/(tabs)/home/minigame/write")}
                >
                    <View className="w-full p-2 overflow-hidden">
                        <View className="flex-1">
                            <View className="w-full border border-[#EEEEEE] bg-white rounded-lg px-3 py-5 gap-2">
                                {/* Name Row */}
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="rounded-full bg-[#3A6FE6]/30 border border-[#3A6FE6] p-2">
                                            <Heart width={24} height={24} color="#3A6FE6" />
                                        </View>
                                        <View className="h-full gap-1 flex-1">
                                            <Text className="text-base font-[Poppins-Bold]">Inner Explorer</Text>
                                            <Text className="text-base font-[Poppins-Regular]">
                                                Write your feelings daily for a week
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="mb-10 ml-2">
                                        <View className="flex-row items-center justify-center h-8 bg-[#3A6FE6]/30 rounded-lg px-3">
                                            <Text className="text-[#3A6FE6] font-[Poppins-SemiBold] text-base">+30 pts</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Progress Row */}
                                <View className="flex-row items-center justify-between px-8">
                                    <Progress.Bar
                                        progress={6/7}
                                        width={200}
                                        color="#3A6FE6"
                                        borderRadius={10}
                                    />
                                    <Text className="text-sm font-[Poppins-Bold] ml-3">
                                        6/7 days
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Minigame 2 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/(tabs)/home/minigame/share")}
                >
                    <View className="w-full p-2 overflow-hidden">
                        <View className="flex-1">
                            <View className="w-full border border-[#EEEEEE] bg-white rounded-lg px-3 py-5 gap-2">
                                {/* Name Row */}
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="rounded-full bg-[#4CAADD]/30 border border-[#4CAADD] p-2">
                                            <Sun width={24} height={24} color="#4CAADD" />
                                        </View>
                                        <View className="h-full gap-1 flex-1">
                                            <Text className="text-base font-[Poppins-Bold]">Spreading Smile</Text>
                                            <Text className="font-[Poppins-Regular] text-base">
                                                Share three posts on the forum for a month
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="mb-10 ml-2">
                                        <View className="flex-row items-center justify-center h-8 bg-[#4CAADD]/30 rounded-lg px-3">
                                            <Text className="text-[#4CAADD] font-[Poppins-SemiBold] text-base">+50 pts</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Progress Row */}
                                <View className="flex-row items-center justify-between px-8">
                                    <Progress.Bar
                                        progress={1/3}
                                        width={200}
                                        color="#4CAADD"
                                        borderRadius={10}
                                    />
                                    <Text className="text-sm font-[Poppins-Bold] ml-3">
                                        1/3 posts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Minigame 3 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/(tabs)/home/minigame/comment")}
                >
                    <View className="w-full p-2 overflow-hidden">
                        <View className="flex-1">
                            <View className="w-full border border-[#EEEEEE] bg-white rounded-lg px-3 py-5 gap-2">
                                {/* Name Row */}
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="rounded-full bg-[#34D1BF]/30 border border-[#34D1BF] p-2">
                                            <Rainbow width={24} height={24} color="#34D1BF" />
                                        </View>
                                        <View className="h-full gap-1 flex-1">
                                            <Text className="text-base font-[Poppins-Bold]">Light Bearer</Text>
                                            <Text className="font-[Poppins-Regular] text-base">
                                                Leave positive messages on five different posts
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="mb-10 ml-2">
                                        <View className="flex-row items-center justify-center h-8 bg-[#34D1BF]/30 rounded-lg px-3">
                                            <Text className="text-[#34D1BF] font-[Poppins-SemiBold] text-base">+70 pts</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Progress Row */}
                                <View className="flex-row items-center justify-between px-8">
                                    <Progress.Bar
                                        progress={0/5}
                                        width={200}
                                        color="#34D1BF"
                                        borderRadius={10}
                                    />
                                    <Text className="text-sm font-[Poppins-Bold] ml-3">
                                        0/5 posts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Badges */}
                <View className="mt-6">
                    <View className="flex-col gap-6">
                        <Text className="font-[Poppins-Bold] text-lg">My Badges</Text>
                        <View className="flex-row px-6 justify-between">
                            {/* Badge 1 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#3A6FE6]/30 border border-[#3A6FE6] p-2">
                                    <Radar width={36} height={36} className="rounded-full overflow-hidden" color="#3A6FE6" />
                                </View>
                                <Text className="text-base text-[#3A6FE6] font-[Poppins-SemiBold]">PathFinder</Text>
                            </View>
                            {/* Badge 2 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                                    <HandHeart width={36} height={36} className="rounded-full overflow-hidden" color="#CCCCCC" />
                                </View>
                                <Text className="text-[#CCCCCC] text-base text-base font-[Poppins-SemiBold]">SilentHealer</Text>
                            </View>
                            {/* Badge 3 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                                    <SunMoon width={36} height={36} className="rounded-full overflow-hidden" color="#CCCCCC" />
                                </View>
                                <Text className="text-[#CCCCCC] text-base text-base font-[Poppins-SemiBold]">LightBearer</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}