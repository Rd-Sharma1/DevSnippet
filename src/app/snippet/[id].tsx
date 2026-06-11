import {
  Colors,
  Radius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import {
  deleteSnippet,
  getSnippetById,
  snippetDataType,
  toggleFavorite,
} from "@/database/snippetQueries";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EnhanceWithAI, { AiResponseType } from "../services/ai_service";

const SnippetDetail = () => {
  const snippetId = Number(useLocalSearchParams().id);
  const [snippetDetail, setSnippetDetail] = useState<snippetDataType | null>(
    null,
  );
  const [aiData, setAiData] = useState<AiResponseType>();

  const loadSnippet = () => {
    if (!Number.isNaN(snippetId)) {
      setSnippetDetail(getSnippetById(snippetId));
    }
  };
  useFocusEffect(() => {
    loadSnippet();
  });
  useEffect(() => {
    loadSnippet();
  }, [snippetId]);

  const handleToggleFavorite = () => {
    if (snippetDetail?.id != null) {
      toggleFavorite(snippetDetail.id, snippetDetail.isFavorite === 1 ? 0 : 1);
      loadSnippet();
    }
  };

  const handleDelete = () => {
    deleteSnippet(snippetId);
    router.back();
  };

  const handleEdit = () => {
    router.push(`/createSnippets?id=${snippetId}`);
  };

  const handleAiRespnse = async () => {
    snippetDetail && setAiData(await EnhanceWithAI(snippetDetail));
  };

  const btnText =
    snippetDetail?.isFavorite === 1
      ? "Remove from favorites"
      : "Add to Favorites";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Snippet</Text>
        <View style={{ flexDirection: "row", gap: Spacing.lg }}>
          <Pressable onPress={handleDelete}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={Colors.dark.danger}
            />
          </Pressable>
          <Pressable onPress={handleEdit}>
            <Ionicons name="pencil" size={24} color={Colors.dark.success} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{snippetDetail?.title}</Text>
          {snippetDetail?.description && (
            <Text style={styles.description}>{snippetDetail.description}</Text>
          )}

          {snippetDetail?.language && (
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{snippetDetail.language}</Text>
              </View>
              {snippetDetail.isFavorite === 1 && (
                <View style={[styles.badge, styles.favoriteBadge]}>
                  <Ionicons
                    name="heart"
                    size={14}
                    color={Colors.dark.warning}
                  />
                  <Text style={styles.badgeText}>Favorite</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Code</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>{snippetDetail?.code}</Text>
          </View>
        </View>

        {snippetDetail?.tags && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {snippetDetail.tags.split(",").map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {snippetDetail?.aiSummary && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{snippetDetail.aiSummary}</Text>
          </View>
        )}
      </ScrollView>
      {aiData ? (
        <ScrollView>
          <View>
            <Text>Ai Summary</Text>
            <Text>{aiData.summary}</Text>
          </View>
          <View>
            <Text>Suggested Improvements</Text>
            <Text>{aiData.improvements}</Text>
          </View>
        </ScrollView>
      ) : (
        <Pressable
          onPress={() => {
            console.log("Enhance with AI clicked");
            handleAiRespnse();
          }}
        >
          <Text style={styles.aiBtn}>Enhance with AI</Text>
        </Pressable>
      )}

      <View style={styles.footer}>
        <Pressable style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Ionicons
            name={snippetDetail?.isFavorite === 1 ? "heart" : "heart-outline"}
            size={20}
            color={
              snippetDetail?.isFavorite === 1
                ? Colors.dark.warning
                : Colors.dark.background
            }
          />
          <Text style={styles.favoriteButtonText}>{btnText}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SnippetDetail;

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
  headerTitle: {
    ...Typography.h3,
    color: Colors.dark.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  title: {
    ...Typography.h2,
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  badge: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  favoriteBadge: {
    backgroundColor: `${Colors.dark.warning}20`,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badgeText: {
    ...Typography.label,
    color: Colors.dark.text,
  },
  codeBlock: {
    backgroundColor: Colors.dark.background,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.accent,
  },
  code: {
    ...Typography.code,
    color: Colors.dark.textSecondary,
    fontFamily: "monospace",
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  tagText: {
    ...Typography.label,
    color: Colors.dark.background,
  },
  summaryText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  favoriteButtonText: {
    ...Typography.button,
    color: Colors.dark.background,
  },
  aiBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: Colors.dark.backgroundSelected,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    ...Shadows.lg,
  },
});
