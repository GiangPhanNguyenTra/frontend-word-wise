import Illustrator1 from "@/assets/images/introduce1.svg";
import Illustrator2 from "@/assets/images/introduce2.svg";
import Illustrator3 from "@/assets/images/introduce3.svg";
import Illustrator4 from "@/assets/images/introduce4.svg";
import Illustrator5 from "@/assets/images/introduce5.svg";
import Illustrator6 from "@/assets/images/introduce6.svg";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ArrowRight } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    step: "Step One",
    title: "Create Your Own Vocabulary ",
    highlight: "Collections",
    description: "Group words into themes that match your goals and learning style.",
    image: Illustrator1,
    highlightColor: "#EB8D25",
  },
  {
    id: 2,
    step: "Step Two",
    title: "",
    highlight: "Quickly Access ",
    subtitle: " Any Word You Saved",
    description: "Tap to view meaning, example sentences, and practice right away.",
    image: Illustrator2,
    highlightColor: "#C16666",
  },
  {
    id: 3,
    step: "Step Three",
    title: "Learn with ",
    highlight: "Flashcards ",
    subtitle: "& Quizzes",
    description: "Test your memory anytime with simple, fun review methods.",
    image: Illustrator3,
    highlightColor: "#2563EB",
  },
  {
    id: 4,
    step: "Step Four",
    title: "Practice ",
    highlight: "Pronunciation ",
    subtitle: "& Get Instant Feedback",
    description:"Record your voice, improve clarity, and build confidence step by step.",
    image: Illustrator4,
    highlightColor: "#0EB1AE",
  },
  {
    id: 5,
    step: "Step Five",
    title: "",
    highlight: "Track ",
    subtitle: "Your Learning Journey",
    description: "See words learned, memory retention, and pronunciation progress in simple charts.",
    image: Illustrator5,
    highlightColor: "#AD5FD5",
  },
  {
    id: 6,
    step: "Step Six",
    title: "",
    highlight: "Chat & Learn ",
    subtitle: "with       Friends",
    description: "Stay connected and support each other anywhere.",
    image: Illustrator6,
    highlightColor: "#D3750F",
  }
];

export default function Introduce() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      }
    } else {
      router.push("/(auth)/login"); // hết slide thì chuyển trang
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF] pt-12" onLayout={onLayoutRootView}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 w-full">
            {/* Step chip */}
            <View className="items-center mt-[20px]">
              <View className="rounded-[32px] border border-stone-700 px-3.5 py-2">
                <Text className="text-center text-stone-700 text-base font-[Poppins-Regular]">
                  {item.step}
                </Text>
              </View>
            </View>

            {/* Illustration */}
            <View className="flex-1 items-center justify-center w-full">
              <item.image width="100%" height={550} style={{ zIndex: -2 }} />
            </View>
            <View
              className="absolute"
              style={{
                width: 700,
                height: 800,
                borderRadius: 300,
                backgroundColor: "white",
                bottom: "-85%",
                left: "-40%",
                zIndex: -1,
              }}
            />
            {/* Progress bar */}
            <View className="items-center mb-6">
              <View className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden mb-6">
                <View
                  className="h-2 bg-[#92B1F5]"
                  style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                />
              </View>
            </View>
            {/* Title */}
            <Text className="text-center font-[Poppins-Bold] text-3xl mb-4">
              {item.title}
              <Text style={{ color: item.highlightColor }}>
                {item.highlight}
              </Text>
              {item.subtitle}
            </Text>
            <Text className="text-center font-[Poppins-Regular] text-base mb-4 px-6">{item.description}</Text>
          </View>
        )}
      />

      {/* Footer */}
      <View className="items-center mb-8 bg-white">
        {/* Circle button */}
        <TouchableOpacity
          onPress={handleNext}
          className="w-16 h-16 rounded-full bg-[#2563EB] items-center justify-center shadow-lg mb-24"
        >
          <Text className="text-white text-2xl">
            <ArrowRight color={"#fff"} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}