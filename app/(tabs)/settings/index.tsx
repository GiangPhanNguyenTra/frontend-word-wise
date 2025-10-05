import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ChevronRight, CircleUserRound, Lock, LogOut } from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Settingscreen() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(auth)/login");
  };
  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Setting" />
        
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="py-3 px-1 gap-4">
          {/* Account */}
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-[#EEEEEE] bg-white px-3 justify-center"
            onPress={() => router.push("/(tabs)/settings/account")}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <CircleUserRound width={24} height={24} strokeWidth={1}/>
                <Text className="font-[Poppins-Regular] text-base">Account</Text>
              </View>
              <ChevronRight width={24} height={24} strokeWidth={1} />
            </View>
          </TouchableOpacity>
          {/* Password */}
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-[#EEEEEE] bg-white px-3 justify-center"
            onPress={() => router.push("/(tabs)/settings/password")}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <Lock width={24} height={24} strokeWidth={1} />
                <Text className="font-[Poppins-Regular] text-base">Password</Text>
              </View>
              <ChevronRight width={24} height={24} strokeWidth={1} />
            </View>
          </TouchableOpacity>
          {/* Signout */}
          <TouchableOpacity
            className="w-full h-14 px-3 justify-center"
            onPress={handleCancel}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <LogOut width={24} height={24} color="#FF0000" />
                <Text className="text-[#FF0000] font-[Poppins-Bold] text-base">Sign Out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
              Are you sure you want to logout?
            </Text>
            
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-gray-800">No</Text>
              </TouchableOpacity>
            
              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}