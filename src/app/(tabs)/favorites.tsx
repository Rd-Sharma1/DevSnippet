import ListSnippets from "@/components/ListSnippets";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { getAllSnippets, snippetDataType } from "@/database/snippetQueries";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoriteScreen = () => {
  const [snippetList, setSnippetList] = useState<snippetDataType[]>([]);

  useFocusEffect(
    useCallback(() => {
      const list = getAllSnippets();
      const favoriteSnippets = list.filter(snippet => snippet.isFavorite === 1);
      setSnippetList(favoriteSnippets);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.count}>{snippetList.length}</Text>
      </View>
      <ListSnippets data={snippetList} />
    </SafeAreaView>
  );
};

export default FavoriteScreen;

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
  count: {
    ...Typography.body,
    color: Colors.dark.accent,
    backgroundColor: Colors.dark.surfaceAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
});

