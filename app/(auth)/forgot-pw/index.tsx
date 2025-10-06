import CreateAccount from "@/assets/images/account_create.svg";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import FooterAgreement from "./components/FooterAgreement";
import NewPassword from "./components/NewPassword";
import OTPInput from "./components/OTPInput";

export default function SignupPager() {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();

  const totalSteps = 3;

  const goNext = () => {
    const next = Math.min(page + 1, 3); // cho phép qua màn 3 (success)
    pagerRef.current?.setPage(next);
    setPage(next);
  };
  const goPrev = () => {
    if (page === 0) {
      router.back();
    } else {
      const prev = Math.max(page - 1, 0);
      pagerRef.current?.setPage(prev);
      setPage(prev);
    }
  };

  // Các tiêu đề cho từng trang (trang cuối không cần heading)
  const headings = [
    "Add your email 1/3",
    "Verify your email 2/3",
    "Create your password 3/3",
  ];

  const Heading = () =>
    page < 3 ? (
      <View className="px-6 pt-12 mb-4">
        {/* Back button + heading */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={goPrev}
            className="w-12 h-12 rounded-[10px] items-center justify-center mr-4"
          >
            <ChevronLeft size={30} color="#000000" />
          </TouchableOpacity>
          <Text className="text-2xl font-[Montserrat-Medium] text-black">
            {headings[page]}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="flex-row justify-center">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const active = i <= page;
            return (
              <View
                key={i}
                className="flex-1 h-2 mx-0.5 rounded-full"
                style={{
                  backgroundColor: active ? "#92B1F5" : "#EDECEF",
                }}
              />
            );
          })}
        </View>
      </View>
    ) : null;

  return (
    <View className="flex-1 bg-[#FAF9FF] w-full">
      {/* Heading + Progress */}
      <Heading />

      {/* PagerView */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        scrollEnabled={false} // không cho vuốt thủ công
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {/* Screen 1 */}
        <View key="1" className="flex-1 px-6">
          <Text className="text-base font-[Montserrat-Medium] text-[#ABABAB] mb-2 mt-8">
            Email Address
          </Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            className="w-full h-16 bg-[#F7F8F9] rounded-[10px] px-4 border border-[#DADADA] font-[Montserrat-Regular]"
          />

          <TouchableOpacity
            onPress={goNext}
            className="w-full h-16 rounded-lg items-center justify-center bg-[#2563EB] mt-10"
          >
            <Text className="text-white font-[Montserrat-Bold] text-base">
              Create an account
            </Text>
          </TouchableOpacity>
          <FooterAgreement />
        </View>

        {/* Screen 2 */}
        <View key="2" className="flex-1 px-6">
          <Text className="text-base font-[Montserrat-Medium] text-[#27252E] mb-8 mt-8 text-center">
            We just sent a 4-digit code to {email || "exampleemail@gmail.com"},
            enter it below:
          </Text>
          <Text className="text-[#ABABAB] font-[Montserrat-Bold]">Code</Text>
          <OTPInput length={4} onComplete={(val) => setCode(val)} />

          <TouchableOpacity
            onPress={goNext}
            disabled={code.length < 4}
            className={`w-full h-16 rounded-lg items-center justify-center mt-8 ${
              code.length < 4 ? "bg-gray-300" : "bg-[#2563EB]"
            }`}
          >
            <Text className="text-white font-[Montserrat-Bold] text-base">
              Verify email
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-4">
            <Text className="text-black font-[Montserrat-Regular]">
              Wrong email?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                pagerRef.current?.setPage(0);
                setPage(0);
                setEmail("");
              }}
            >
              <Text className="text-[#2563EB] font-[Montserrat-Medium]">
                Send to different email
              </Text>
            </TouchableOpacity>
          </View>
          <FooterAgreement />
        </View>

        {/* Screen 3 */}
        <View key="3" className="flex-1 px-6 mt-8">
          <NewPassword
            onValidChange={(valid, val) => {
              setPassword(valid ? val : "");
            }}
          />

          <TouchableOpacity
            onPress={goNext}
            disabled={code.length < 3}
            className={`w-full h-16 rounded-lg items-center justify-center mt-8 ${
              code.length < 3 ? "bg-gray-300" : "bg-[#2563EB]"
            }`}
          >
            <Text className="text-white font-[Montserrat-Bold] text-base">
              Continue
            </Text>
          </TouchableOpacity>
          <FooterAgreement />
        </View>

        {/* Screen 4: Success */}
        <View className="flex-1 items-center justify-center mt-40 px-6">
          <CreateAccount width={100} height={100} />
          <Text className="text-3xl font-[Montserrat-Bold] mb-6 text-center mt-20">
            Your account was successfully created!
          </Text>
          <Text className="text-lg font-[Montserrat-Regular] mb-6 text-center">
            Only one click to explore online education.
          </Text>
          <TouchableOpacity
            className="w-full h-16 rounded-lg items-center justify-center bg-[#2563EB]"
            onPress={() => router.push("/login")}
          >
            <Text
              className="text-white font-[Montserrat-Bold]"
              onPress={() => router.push("/(auth)/login")}
            >
              Log In
            </Text>
          </TouchableOpacity>
          <FooterAgreement />
        </View>
      </PagerView>
    </View>
  );
}