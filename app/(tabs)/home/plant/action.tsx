import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// SVGs
import Plant1 from "@/assets/images/plant1.svg";
import Plant2 from "@/assets/images/plant2.svg";
import Plant3 from "@/assets/images/plant3.svg";
import Plant4 from "@/assets/images/plant4.svg";
import Plant5 from "@/assets/images/plant5.svg";
import Plant6 from "@/assets/images/plant6.svg";
import Plant7 from "@/assets/images/plant7.svg";
import Plant8 from "@/assets/images/plant8.svg";
import WaterDrop from "@/assets/images/water.svg";

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

export default function ActionScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // ===== Mock dữ liệu =====
  const xpThresholds = [0, 50, 100, 200, 300, 500, 1000, 2000];
  const getLevel = (xp: number) => {
    let level = 1;
    for (let i = 1; i < xpThresholds.length; i++) {
      if (xp >= xpThresholds[i]) level = i + 1;
    }
    return level > 8 ? 8 : level;
  };

  const initialXp = 75;
  const addedXp = 10;
  const [currentXp, setCurrentXp] = useState(initialXp);
  const [level, setLevel] = useState(getLevel(initialXp));
  const [showButton, setShowButton] = useState(false);
  const [showDrop, setShowDrop] = useState(true);
  const [showXpText, setShowXpText] = useState(false);

  const PlantImages = {
    1: Plant1,
    2: Plant2,
    3: Plant3,
    4: Plant4,
    5: Plant5,
    6: Plant6,
    7: Plant7,
    8: Plant8,
  };
  const PlantToShow = PlantImages[level as keyof typeof PlantImages];

  const nextLevelXp = level < 8 ? xpThresholds[level] : xpThresholds[7];
  const currentLevelXp = xpThresholds[level - 1] || 0;
  const initialProgress =
    ((initialXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  const [progress, setProgress] = useState(initialProgress);

  const dropY = useSharedValue(height * 0.1);
  const xpTranslateY = useSharedValue(0);

  useEffect(() => {
    if (!fontsLoaded) return;

    dropY.value = withTiming(
      height * 0.3,
      {
        duration: 1500,
        easing: Easing.out(Easing.quad),
      },
      () => {
        runOnJS(setShowDrop)(false);
        runOnJS(setShowXpText)(true);

        // hiệu ứng trượt nhẹ lên
        xpTranslateY.value = withTiming(-40, { duration: 1000 });
      }
    );

    const timeout1 = setTimeout(() => {
      let value = initialXp;
      const interval = setInterval(() => {
        value += 1;
        const newXp = Math.min(initialXp + addedXp, value);
        const newLevel = getLevel(newXp);
        const newNext = newLevel < 8 ? xpThresholds[newLevel] : xpThresholds[7];
        const newCurrent = xpThresholds[newLevel - 1] || 0;
        const pct = ((newXp - newCurrent) / (newNext - newCurrent)) * 100;

        setCurrentXp(newXp);
        setLevel(newLevel);
        setProgress(pct);

        if (value >= initialXp + addedXp) {
          clearInterval(interval);
          setShowButton(true);
        }
      }, 100);
    }, 1000);

    return () => clearTimeout(timeout1);
  }, [fontsLoaded]);

  const dropStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dropY.value }],
  }));

  const xpStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: xpTranslateY.value }],
  }));

  if (!fontsLoaded) return null;

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#FAF9FF" }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      extraScrollHeight={50}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
    >
      <View className="flex-1 bg-[#FAF9FF]" onLayout={onLayoutRootView}>
        <Heading title="Plant Tree" />
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}
        >
          {/* Cây */}
          <View className="mt-16">
            <PlantToShow width={200} height={250} />
          </View>

          {/* +10XP hiện lên và giữ nguyên */}
          {showXpText && (
            <Animated.Text
              className={"mt-4"}
              style={[
                xpStyle,
                {
                  position: "absolute",
                  top: height * 0.38,
                  fontSize: 24,
                  fontFamily: "Poppins-Bold",
                  color: "#7CB342",
                },
              ]}
            >
              +{addedXp} XP
            </Animated.Text>
          )}

          {/* Giọt nước */}
          {showDrop && (
            <Animated.View
              style={[
                dropStyle,
                { position: "absolute", left: "50%", marginLeft: -30 },
              ]}
            >
              <WaterDrop width={60} height={60} />
            </Animated.View>
          )}

          {/* XP hiện tại */}
          <Text className="mt-8 text-[#4F3422] font-[Poppins-Medium] text-base">
            {currentXp}/{nextLevelXp} XP
          </Text>

          {/* Thanh progress */}
          <View className="mt-2 w-full px-6">
            <View className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
              <View
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#7CB342",
                  height: "100%",
                }}
              />
            </View>
          </View>

          <Text className="font-[Poppins-Bold] text-[#4F3422] text-xl mt-10 text-center">
            Your tree has grown more! Keep cultivating positivity.
          </Text>

          {/* Nút quay lại */}
          {showButton && (
            <TouchableOpacity
              className="bg-[#7F56D9] h-14 rounded-xl mt-10 items-center justify-center w-full"
              onPress={() => router.replace("/(tabs)/home/plant")}
            >
              <Text className="text-white font-[Poppins-Bold] text-base">
                Turn Back to My Tree
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
}
