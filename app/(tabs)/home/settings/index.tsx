import Heading from "@/components/Heading";
import { changePassword, updateUserInfo } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Eye, EyeOff, LogOut, PenLine, Save } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

export default function SettingScreen() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account State
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [email, setEmail] = useState("");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Editing Modes
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Load User Data
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const userStr = await AsyncStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            const name = user.username || "";
            setUsername(name);
            setOriginalUsername(name);
            setEmail(user.email || "");
          }
        } catch (error) {
          console.error("Failed to load user", error);
        }
      };
      loadUser();
    }, [])
  );

  const isAccountChanged =
    username.trim() !== originalUsername.trim() && username.trim() !== "";

  const isPasswordFilled =
    currentPassword !== "" && newPassword !== "" && confirmPassword !== "";

  const handleLogout = async () => {
    setShowConfirm(false);
    try {
      await AsyncStorage.multiRemove(["accessToken", "user"]);
      router.replace("/(auth)/login");
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "See you again soon!",
      });
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleEditOrSaveAccount = async () => {
    if (!isEditingAccount) {
      setIsEditingAccount(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateUserInfo({ username });

      if (res.success && res.data) {
        if (res.data.newToken) {
          await AsyncStorage.setItem("accessToken", res.data.newToken);
        }

        const currentUserStr = await AsyncStorage.getItem("user");
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : {};
        const updatedUser = {
          ...currentUser,
          username: res.data.userInfo.username,
        };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        setOriginalUsername(res.data.userInfo.username);

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "User information updated successfully",
        });
        setIsEditingAccount(false);
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrSavePassword = async () => {
    if (!isEditingPassword) {
      setIsEditingPassword(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mismatch",
        text2: "New passwords do not match",
      });
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        reNewPassword: confirmPassword,
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password changed successfully",
      });

      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message || "Failed to change password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <Heading title="Settings" />

      <KeyboardAwareScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-[20px] p-6 gap-4 shadow-sm">
          {/* Account */}
          <Text className="font-[Montserrat-SemiBold] text-lg text-[#1F2937]">
            Account Information
          </Text>

          {/* Username */}
          <Text className="font-[Montserrat-Medium] text-[#4B5563]">
            Username
          </Text>
          <TextInput
            editable={isEditingAccount}
            className={`h-16 w-full rounded-xl border bg-white px-3 font-[Montserrat-Regular] ${
              isEditingAccount
                ? "border-[#2563EB] text-black"
                : "border-[#EEEEEE] text-[#737373]"
            }`}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#7B7B7B"
          />

          {/* Email */}
          <Text className="font-[Montserrat-Medium] text-[#4B5563]">Email</Text>
          <TextInput
            editable={false}
            className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-gray-50 px-3 font-[Montserrat-Regular] text-[#737373]"
            value={email}
            placeholder="Email"
            placeholderTextColor="#7B7B7B"
          />

          <View className="items-center justify-center">
            <TouchableOpacity
              onPress={handleEditOrSaveAccount}
              disabled={isLoading || (isEditingAccount && !isAccountChanged)}
              className={`flex-row items-center justify-center gap-2 mb-6 w-[150px] py-4 rounded-full ${
                isEditingAccount
                  ? !isAccountChanged
                    ? "bg-gray-300"
                    : "bg-green-600"
                  : "bg-[#2563EB]"
              }`}
            >
              {isLoading && isEditingAccount ? (
                <ActivityIndicator color="white" />
              ) : isEditingAccount ? (
                <>
                  <Save size={18} color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">
                    Save
                  </Text>
                </>
              ) : (
                <>
                  <PenLine size={18} color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">
                    Edit
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Password Section */}
          <Text className="font-[Montserrat-SemiBold] text-lg text-[#1F2937] border-t border-gray-100 pt-4">
            Change Password
          </Text>

          {/* Current Password */}
          <Text className="font-[Montserrat-Medium] text-[#4B5563]">
            Current Password
          </Text>
          <View
            className={`w-full h-16 bg-white border rounded-xl px-4 flex-row items-center ${
              isEditingPassword ? "border-[#2563EB]" : "border-[#EEEEEE]"
            }`}
          >
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
          <Text className="font-[Montserrat-Medium] text-[#4B5563]">
            New Password
          </Text>
          <View
            className={`w-full h-16 bg-white border rounded-xl px-4 flex-row items-center ${
              isEditingPassword ? "border-[#2563EB]" : "border-[#EEEEEE]"
            }`}
          >
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
          <Text className="font-[Montserrat-Medium] text-[#4B5563]">
            Confirm Password
          </Text>
          <View
            className={`w-full h-16 bg-white border rounded-xl px-4 flex-row items-center ${
              isEditingPassword ? "border-[#2563EB]" : "border-[#EEEEEE]"
            }`}
          >
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
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <Eye size={22} color="#6A707C" />
              ) : (
                <EyeOff size={22} color="#6A707C" />
              )}
            </Pressable>
          </View>

          <View className="items-center justify-center">
            <TouchableOpacity
              onPress={handleEditOrSavePassword}
              disabled={isLoading || (isEditingPassword && !isPasswordFilled)}
              className={`flex-row items-center justify-center gap-2 mb-6 w-[150px] py-4 rounded-full ${
                isEditingPassword
                  ? !isPasswordFilled
                    ? "bg-gray-300"
                    : "bg-green-600"
                  : "bg-[#2563EB]"
              }`}
            >
              {isLoading && isEditingPassword ? (
                <ActivityIndicator color="white" />
              ) : isEditingPassword ? (
                <>
                  <Save size={18} color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">
                    Save
                  </Text>
                </>
              ) : (
                <>
                  <PenLine size={18} color="white" />
                  <Text className="text-white text-center font-[Montserrat-Bold]">
                    Edit
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View className="items-center justify-center">
          <TouchableOpacity
            className="w-[200px] rounded-[50px] px-3 py-4 mt-10 items-center justify-center bg-white border border-[#C30000]"
            onPress={() => setShowConfirm(true)}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <LogOut width={24} height={24} color="#C30000" />
                <Text className="text-[#C30000] font-[Montserrat-Bold] text-lg">
                  Log Out
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Confirm Logout Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowConfirm(false)}>
          <View className="flex-1 bg-black/60 justify-center items-center">
            <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
              <Text className="text-lg font-[Montserrat-SemiBold] mb-6 text-gray-800 text-center">
                Are you sure you want to logout?
              </Text>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => setShowConfirm(false)}
                  className="bg-gray-200 px-8 py-3 rounded-xl"
                >
                  <Text className="text-base font-[Montserrat-SemiBold] text-gray-800">
                    No
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  className="bg-red-500 px-8 py-3 rounded-xl"
                >
                  <Text className="text-base font-[Montserrat-SemiBold] text-white">
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
