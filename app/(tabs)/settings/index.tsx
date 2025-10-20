"use client";

import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Eye, EyeOff, LogOut, PenLine, Save } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Settingscreen() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("phanGiang293");
  const [email, setEmail] = useState("phanGiang293@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("phanGiang");
  const [newPassword, setNewPassword] = useState("phanGiang293");
  const [confirmPassword, setConfirmPassword] = useState("phanGiang293");

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleCancel = () => setShowConfirm(true);

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(auth)/login");
  };

  const handleEditOrSaveAccount = () => {
    if (isEditingAccount) {
      console.log("Saved:", { username, email });
    }
    setIsEditingAccount(!isEditingAccount);
  };

  const handleEditOrSaveAccountPassword = () => {
    if (isEditingAccount) {
      console.log("Saved:", { currentPassword, newPassword, confirmPassword });
    }
    setIsEditingPassword(!isEditingPassword);
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Settings" />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-white rounded-[20px] p-6 gap-4">
          {/* Account */}
          <Text className="font-[Montserrat-SemiBold] text-lg">Account Information</Text>
          {/* Username */}
          <Text className="font-[Montserrat-Medium]">Username</Text>
          <TextInput
            editable={isEditingAccount}
            className={`h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Montserrat-Regular] ${
              !isEditingAccount ? "text-[#737373]" : "text-black"
            }`}
            value={username}
            onChangeText={setUsername}
            placeholder="phanGiang293"
            placeholderTextColor="#7B7B7B"
          />
          {/* Email */}
          <Text className="font-[Montserrat-Medium]">Email</Text>
          <TextInput
            editable={isEditingAccount}
            className={`h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Montserrat-Regular] ${
              !isEditingAccount ? "text-[#737373]" : "text-black"
            }`}
            value={email}
            onChangeText={setEmail}
            placeholder="phanGiang293@gmail.com"
            placeholderTextColor="#7B7B7B"
          />

          <View className="items-center justify-center">
            <TouchableOpacity
              onPress={handleEditOrSaveAccount}
              className={`flex-row items-center justify-center gap-2 mb-6 w-[150px] py-4 rounded-full ${
                isEditingAccount ? "bg-green-600" : "bg-[#2563EB]"
              }`}
            >
              {isEditingAccount ? (
                <>
                  <Save size="18" color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">Save</Text>
                </>
              ) : (
                <>
                  <PenLine size="18" color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">Edit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          {/* Password */}
          <Text className="font-[Montserrat-SemiBold] text-lg">Change Password</Text>
          {/* Current Password */}
          <Text className="font-[Montserrat-Medium]">Current Password</Text>
          <View className="w-full h-16 bg-white border border-[#EEEEEE] rounded-xl px-4 flex-row items-center">
            <TextInput
              editable={isEditingPassword}
              className={`flex-1 font-[Montserrat-Regular] ${
              !isEditingPassword ? "text-[#737373]" : "text-black"
            }`}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter your current password"
              placeholderTextColor="#7B7B7B"
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye size={22} color="#6A707C" />
              ) : (
                <EyeOff size={22} color="#6A707C" />
              )}
            </Pressable>
          </View>
          {/* New Password */}
          <Text className="font-[Montserrat-Medium]">New Password</Text>
          <View className="w-full h-16 bg-white border border-[#EEEEEE] rounded-xl px-4 flex-row items-center">
            <TextInput
              editable={isEditingPassword}
              className={`flex-1 font-[Montserrat-Regular] ${
              !isEditingPassword ? "text-[#737373]" : "text-black"
            }`}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter your new password"
              placeholderTextColor="#7B7B7B"
              secureTextEntry={!showNewPassword}
            />
            <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? (
                <Eye size={22} color="#6A707C" />
              ) : (
                <EyeOff size={22} color="#6A707C" />
              )}
            </Pressable>
          </View>
          {/* Confirm Password */}
          <Text className="font-[Montserrat-Medium]">Confirm Password</Text>
          <View className="w-full h-16 bg-white border border-[#EEEEEE] rounded-xl px-4 flex-row items-center">
            <TextInput
              editable={isEditingPassword}
              className={`flex-1 font-[Montserrat-Regular] ${
              !isEditingPassword ? "text-[#737373]" : "text-black"
            }`}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              placeholderTextColor="#7B7B7B"
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <Eye size={22} color="#6A707C" />
              ) : (
                <EyeOff size={22} color="#6A707C" />
              )}
            </Pressable>
          </View>
          <View className="items-center justify-center">
            <TouchableOpacity
              onPress={handleEditOrSaveAccountPassword}
              className={`flex-row items-center justify-center gap-2 mb-6 w-[150px] py-4 rounded-full ${
                isEditingPassword ? "bg-green-600" : "bg-[#2563EB]"
              }`}
            >
              {isEditingPassword ? (
                <>
                  <Save size="18" color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">Save</Text>
                </>
              ) : (
                <>
                  <PenLine size="18" color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">Edit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* Logout */}
        <View className="items-center jusity-center">
          <TouchableOpacity
            className="w-[200px] rounded-[50px] px-3 py-4 mt-10 items-center justify-center bg-white border border-[#C30000]"
            onPress={handleCancel}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <LogOut width={24} height={24} color="#C30000" />
                <Text className="text-[#C30000] font-[Montserrat-Bold] text-lg">Log Out</Text>
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
            <Text className="text-lg font-[Montserrat-SemiBold] mb-6 text-gray-800">
              Are you sure you want to logout?
            </Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Montserrat-SemiBold] text-gray-800">No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Montserrat-SemiBold] text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}