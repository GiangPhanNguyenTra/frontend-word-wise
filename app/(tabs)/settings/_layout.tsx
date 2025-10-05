import { Stack } from "expo-router";

export default function SettingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Setting" }} />
            <Stack.Screen name="account" options={{ title: "Tài khoản" }} />
            <Stack.Screen name="password" options={{ title: "Password" }} />
        </Stack>
    );
}