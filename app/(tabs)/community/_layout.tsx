import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="index" options={{ title: "Cộng đồng" }} />
      <Stack.Screen name="add" options={{ title: "Thêm bài viết" }} />
      <Stack.Screen name="comment" options={{ title: "Bình luận" }} />
      <Stack.Screen name="confirm" options={{ title: "Xác minh" }} />
    </Stack>
  );
}
