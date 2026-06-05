// import { insertDemoSnippets } from "@/database/snippetQueries";
import ListSnippets from "@/components/ListSnippets";
import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { getAllSnippets, searchSnippets, snippetDataType } from "@/database/snippetQueries";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [snippetList, setSnippetList] = useState<snippetDataType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [querySnippets, setQuerySnippets] = useState<snippetDataType[]>([]);

  useEffect(() => {
    const list = searchSnippets(searchQuery);
    setQuerySnippets(list);
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      const list = getAllSnippets();
      setSnippetList(list);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DevSnippet</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/createSnippets")}
        >
          <Ionicons name="add" size={24} color={Colors.dark.text} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color={Colors.dark.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search snippets..."
          placeholderTextColor={Colors.dark.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {searchQuery.trim() !== "" ? (
        <ListSnippets data={querySnippets} />
      ) : (
        <ListSnippets data={snippetList} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    ...Typography.h2,
    color: Colors.dark.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.dark.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.dark.text,
    paddingVertical: Spacing.md,
  },
});

