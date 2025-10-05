import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Flame, Heart, MessageCircle, MessageCircleHeart, Sun } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ShareScreen() {
  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Spreading Smile" />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        {/* Badges */}
        <View className="w-full p-2 overflow-hidden">
          <View className="flex-1 rounded-lg bg-white border border-[#EEEEEE] p-2 justify-center items-center overflow-hidden">
            <View className="py-2 gap-2 items-center w-full">
              <View className="rounded-full bg-[#4CAADD]/30 border border-[#4CAADD] p-2">
                <Sun width={36} height={36} color="#4CAADD" />
              </View>
              <Text className="text-lg font-[Poppins-Bold] text-[#4CAADD] text-center">
                Spreading Smile
              </Text>
              <View className="mt-6">
                <View className="flex-col">
                  <View className="flex-row justify-between px-8">
                    {/* Badge 1 */}
                    <View className="flex-col items-center gap-2 w-[100px]">
                      <View className="p-2">
                        <MessageCircleHeart width={24} height={24} color="#4CAADD" />
                      </View>
                      <Text className="text-[#4CAADD] text-base font-[Poppins-Regular] text-center">
                        Teller
                      </Text>
                    </View>

                    {/* Badge 2 */}
                    <View className="flex-col items-center gap-2 w-[100px]">
                      <View className="p-2">
                        <Flame width={24} height={24} color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-base font-[Poppins-Regular] text-center">
                        Beacon
                      </Text>
                    </View>

                    {/* Badge 3 */}
                    <View className="flex-col items-center gap-2 w-[100px]">
                      <View className="p-2">
                        <Sun width={24} height={24} color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-base font-[Poppins-Regular] text-center">
                        Spreading Smile
                    </Text>
                  </View>
                </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Post */}
        <View className="w-full mt-4 p-2 overflow-hidden gap-2">
          <View className="mt-4 p-4 rounded-2xl bg-white border border-[#EEEEEE]">
            {/* Header */}
            <View>
              <Text className="font-[Poppins-SemiBold] text-base">
                user01234567
              </Text>
              <Text className="text-[#7B7B7B] font-[Poppins-Regular] text-sm mt-1">
                12:20:20 26/4/2025
              </Text>
            </View>
            {/* Content */}
            <Text className="font-[Poppins-Regular] text-base mt-3">Tôi vui lắm</Text>
            {/* Interaction */}
            <View className="flex-row mt-3 gap-6">
              <View className="flex-row items-center gap-1">
                <Heart width={18} height={18} />
                <Text className="text-sm font-[Poppins-Regular]">10</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MessageCircle width={18} height={18} />
                <Text className="text-sm font-[Poppins-Regular]">10</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}