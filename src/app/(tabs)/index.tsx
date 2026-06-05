import { router } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>

      <Button
        title="Create Snippet"
        onPress={() => router.push("../createSnippets")}
      />

      <Button title="Go to Snippet" onPress={() => router.push("/snippet/1")} />
    </SafeAreaView>
  );
}
