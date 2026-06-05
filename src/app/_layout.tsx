import { Colors } from "@/constants/theme";
import { initializeDatabase } from "@/database/snippetQueries";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.dark.background },
        }}
      />
    </SafeAreaProvider>
  );
}

