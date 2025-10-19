import { Stack } from "expo-router";

export default function SpeakLayout() {
    return(
        <Stack
            screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
            <Stack.Screen name="index" options={{ title: "Speak" }} />
            <Stack.Screen name="word/index" options={{  title: "Practice Words" }} />
            <Stack.Screen name="tips/index" options={{  title: "Tips" }} />
            <Stack.Screen name="word/practice" options={{  title: "Words" }} />
            <Stack.Screen name="word/result" options={{  title: "Word Result" }} />
        </Stack>
    );
}