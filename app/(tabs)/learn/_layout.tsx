import { Stack } from "expo-router";

export default function LearnLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="index" options={{ title: "Learn" }} />
      <Stack.Screen name="collection/index" options={{ title: "View collection list" }} />
      <Stack.Screen name="collection/add" options={{ title: "Add new collection" }} />
      <Stack.Screen name="collection/preview" options={{ title: "Preview collection details" }} />
      <Stack.Screen name="collection/edit" options={{ title: "Edit word" }} />
      <Stack.Screen name="collection/view/index" options={{ title: "View collection details" }} />
      <Stack.Screen name="collection/learn/flashcard/index" options={{ title: "Learn flashcards" }} />
    </Stack>
  );
}