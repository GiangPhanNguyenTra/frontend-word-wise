import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  onValidChange?: (valid: boolean, value: string) => void;
}

export default function NewPassword({ onValidChange }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);

  const validatePassword = (pw: string) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);

  const handleChange = (field: "pw" | "confirm", value: string) => {
    let newPassword = password;
    let newConfirm = confirm;

    if (field === "pw") {
      setPassword(value);
      newPassword = value;
    } else {
      setConfirm(value);
      newConfirm = value;
    }

    const valid = validatePassword(newPassword) && newConfirm === newPassword;
    onValidChange?.(valid, newPassword);
  };

  return (
    <View>
      <View className="mb-4">
        <Text className="text-base font-[Montserrat-Medium] text-[#ABABAB] mb-2">
          New Password
        </Text>
        <View className="w-full h-16 bg-[#F7F8F9] px-4 flex-row items-center border border-[#DADADA] rounded-[10px]">
          <TextInput
            value={password}
            onChangeText={(val) => handleChange("pw", val)}
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPw}
            className="flex-1 h-14 font-[Montserrat-Regular]"
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            {showPw ? (
              <Eye size={22} color="#6A707C" />
            ) : (
              <EyeOff size={22} color="#6A707C" />
            )}
          </TouchableOpacity>
        </View>
        {!validatePassword(password) && password.length > 0 && (
          <Text className="text-xs text-red-500 mt-1 font-[Montserrat-Regular]">
            • At least 8 characters, 1 uppercase letter, and 1 number.
          </Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-base font-[Montserrat-Medium] text-[#ABABAB] mb-2">
          Confirm Password
        </Text>
        <View className="w-full h-16 bg-[#F7F8F9] px-4 flex-row items-center border border-[#DADADA] rounded-[10px]">
          <TextInput
            value={confirm}
            onChangeText={(val) => handleChange("confirm", val)}
            placeholder="Re-enter password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPw}
            className="flex-1 h-14 font-[Montserrat-Regular]"
          />
        </View>
        {confirm !== password && confirm.length > 0 && (
          <Text className="text-xs text-red-500 mt-1 font-[Montserrat-Regular]">
            • Passwords do not match.
          </Text>
        )}
      </View>
    </View>
  );
}
