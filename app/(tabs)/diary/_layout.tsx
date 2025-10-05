import { Stack } from "expo-router";

export default function DiaryLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} >
            <Stack.Screen name="index" options={{ title: "Diary" }} />
            <Stack.Screen name="next" options={{  title: "Tạo nhật ký" }} />
        </Stack>
    );
}