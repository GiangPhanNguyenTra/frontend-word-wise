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
      <Stack.Screen name="collection/learn/choose/index" options={{ title: "Quiz" }} />
      <Stack.Screen name="collection/learn/match/index" options={{ title: "Match" }} />
      <Stack.Screen name="collection/learn/match/fill" options={{ title: "Filling words" }} />
      <Stack.Screen name="collection/learn/result/index" options={{ title: "Test result" }} />
    </Stack>
  );
}