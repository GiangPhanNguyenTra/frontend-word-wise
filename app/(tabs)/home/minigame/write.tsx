import Heading from "@/components/Heading";
import { BicepsFlexed, CalendarDays, Heart, Sprout } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function WriteScreen() {
  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Inner Explorer" />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        {/* Badges */}
        <View className="w-full p-2 overflow-hidden">
          <View className="flex-1 rounded-lg bg-white border border-[#EEEEEE] p-2 justify-center items-center overflow-hidden">
            <View className="py-2 gap-2 items-center w-full">
              <View className="rounded-full bg-[#3A6FE6]/30 border border-[#3A6FE6] p-2">
                <Heart width={36} height={36} color="#3A6FE6" />
              </View>
              <Text className="text-lg font-[Poppins-Bold] text-center text-[#3A6FE6]">
                Inner Explorer
              </Text>
              <View className="mt-6">
                <View className="flex-col">
                  <View className="flex-row px-8 gap-6">
                    {/* Badge 1 */}
                    <View className="flex-col items-center gap-2">
                      <View className="p-2">
                        <Sprout width={24} height={24} color="#3A6FE6" />
                      </View>
                      <Text className="text-base text-[#3A6FE6] font-[Poppins-Regular]">WordSower</Text>
                    </View>
                    {/* Badge 2 */}
                    <View className="flex-col items-center gap-2">
                      <View className="p-2">
                        <BicepsFlexed width={24} height={24} color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-[Poppins-Regular]">Resilient</Text>
                    </View>
                    {/* Badge 3 */}
                    <View className="flex-col items-center gap-2">
                      <View className="p-2">
                        <Heart width={24} height={24} color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-[Poppins-Regular]">InnerExplorer</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Diary */}
        <View className="w-full p-2 mt-8 overflow-hidden gap-4">
          <View className="flex-1">
            <View className="w-full border border-[#EEEEEE] px-3 py-5 gap-3 bg-white rounded-lg overflow-hidden">
              {/* Date */}
              <View className="w-full">
                <Text className="text-base font-[Poppins-Regular]">Saturday, Jan 19</Text>
              </View>
              {/* Emoji */}
              <View className="h-20 justify-center items-center w-full">
                <CalendarDays width={20} height={20} color="black" />
                <Text className="text-base font-[Poppins-Bold] text-center w-full">
                  Hạnh phúc
                </Text>
              </View>
              {/* Time */}
              <View className="items-center w-full">
                <Text className="text-base font-[Poppins-Regular]">--- 19:01 AM ---</Text>
              </View>
              {/* Content */}
              <View className="items-center w-full">
                <Text className="text-base font-[Poppins-Regular]">
                  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}