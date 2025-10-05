import Heading from "@/components/Heading";
import { CircleStar, HeartHandshake, MessageCircleMore, Rainbow } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function CommentScreen() {
  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Light Bearer" />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        {/* Badges */}
        <View className="w-full p-2 overflow-hidden">
          <View className="flex-1 rounded-lg bg-white border border-[#EEEEEE] p-2 justify-center items-center overflow-hidden">
            <View className="py-2 gap-2 items-center w-full">
              <View className="rounded-full bg-[#34D1BF]/30 border border-[#34D1BF] p-2">
                <Rainbow width={36} height={36} color="#34D1BF" />
              </View>
              <Text className="text-lg font-[Poppins-Bold] text-[#34D1BF] text-center">
                Light Bearer
              </Text>
              <View className="mt-6">
                <View className="flex-col">
                  <View className="flex-row justify-around px-8">
                  {/* Badge 1 */}
                  <View className="flex-col items-center gap-2 w-[100px]">
                    <View className="p-2">
                      <HeartHandshake width={24} height={24} color="#34D1BF" />
                    </View>
                    <Text
                      className="text-base text-[#34D1BF] font-[Poppins-Regular] text-center"
                      numberOfLines={2}
                    >
                      HeartListener
                    </Text>
                  </View>
                  {/* Badge 2 */}
                  <View className="flex-col items-center gap-2 w-[100px]">
                    <View className="p-2">
                      <CircleStar width={24} height={24} color="#CCCCCC" />
                    </View>
                    <Text
                      className="text-[#CCCCCC] text-base font-[Poppins-Regular] text-center"
                      numberOfLines={2}
                    >
                      CircleLight
                    </Text>
                  </View>
                  {/* Badge 3 */}
                  <View className="flex-col items-center gap-2 w-[100px]">
                    <View className="p-2">
                      <Rainbow width={24} height={24} color="#CCCCCC" />
                    </View>
                    <Text
                      className="text-[#CCCCCC] text-base font-[Poppins-Regular] text-center"
                      numberOfLines={2}
                    >
                      LightBearer
                    </Text>
                  </View>
                </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Comment */}
        <View className="w-full p-2 overflow-hidden mt-6 gap-4">
          <View className="flex-1">
            <View className="w-full flex-row items-stretch gap-4 border border-[#EEEEEE] p-4 bg-white rounded-md">
              <View className="items-center">
                <View className="rounded-full bg-[#010440] p-2">
                  <MessageCircleMore width={14} height={14} className="rounded-full overflow-hidden" color="white" />
                </View>                
                <View className="flex-1 w-[2px] bg-[#7B7B7B] mt-1" />
              </View>
              <View className="flex-1 gap-2">
                <View className="flex-col">
                  <Text className="font-[Poppins-Bold] text-base">
                    user1
                  </Text>
                  <Text className="text-[#7B7B7B] font-[Poppins-Regular] text-base">
                    aaaaaaaaaaaaaaaaa
                  </Text>
                </View>
                <View className="gap-1">
                  <Text className="text-[#7B7B7B] text-sm font-[Poppins-Regular]">Jan 01, 19:01</Text>
                  <Text className="text-base font-[Poppins-Regular]">
                    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}