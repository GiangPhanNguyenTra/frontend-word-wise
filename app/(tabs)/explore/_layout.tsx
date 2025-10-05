import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen
        name="/app/(tabs)/explore/index"
        options={{ title: "Explore" }}
      />
      <Stack.Screen
        name="/app/(tabs)/explore/test/index"
        options={{ title: "Thông tin bài test" }}
      />
      <Stack.Screen
        name="/app/(tabs)/explore/test/doing"
        options={{ title: "Làm bài test" }}
      />
      <Stack.Screen
        name="/app/(tabs)/explore/test/done"
        options={{ title: "Kết quả bài test" }}
      />
      <Stack.Screen
        name="/app/(tabs)/explore/result/index"
        options={{ title: "Lịch sử loại bài test" }}
      />
    </Stack>
  );
}
