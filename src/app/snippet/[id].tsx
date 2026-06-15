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
  updateSnippetAISummary,
} from "@/database/snippetQueries";
import { useApiKey } from "@/hooks/use-api-key";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EnhanceWithAI, { AiResponseType } from "../services/ai_service";

const SnippetDetail = () => {
  const snippetId = Number(useLocalSearchParams().id);
  const { apiKey, isLoading: isKeyLoading } = useApiKey();
  const [snippetDetail, setSnippetDetail] = useState<snippetDataType | null>(
    null,
  );
  const [hasLoadedSnippet, setHasLoadedSnippet] = useState(false);
  const [aiData, setAiData] = useState<AiResponseType | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSnippet = () => {
    if (!Number.isNaN(snippetId)) {
      setSnippetDetail(getSnippetById(snippetId));
    }
    setHasLoadedSnippet(true);
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

  const handleAiResponse = async () => {
    if (!snippetDetail) {
      return;
    }

    setIsLoading(true);
    setAiError(null);

    if (!apiKey) {
      setAiError(
        "No Gemini API key configured. Please add your key in Settings to use AI features.",
      );
      setIsLoading(false);
      return;
    }

    const aiResponse = await EnhanceWithAI(snippetDetail, apiKey);

    if (aiResponse) {
      setAiData(aiResponse);
      if (snippetDetail.id) {
        updateSnippetAISummary(snippetDetail.id, aiResponse.summary);
        loadSnippet();
      }
    } else {
      setAiError(
        "AI request failed. Validate your API key and network connection, then retry.",
      );
    }

    setIsLoading(false);
  };

  const btnText =
    snippetDetail?.isFavorite === 1
      ? "Remove from favorites"
      : "Add to Favorites";

  if (isKeyLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderPane}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
          <Text style={styles.loaderText}>Loading secure settings…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasLoadedSnippet && !snippetDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredPane}>
          <Text style={styles.emptyTitle}>Snippet not found</Text>
          <Text style={styles.emptyText}>
            This snippet may have been removed or the link is invalid.
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
        <ScrollView style={styles.aiContainer}>
          <View style={styles.aiCard}>
            <Text style={styles.aiTitle}>AI Summary</Text>
            <Text style={styles.aiSummaryText}>{aiData.summary}</Text>
          </View>

          {aiData.tags.length > 0 && (
            <View style={styles.aiCard}>
              <Text style={styles.aiTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {aiData.tags.map((tag, i) => (
                  <View key={i} style={styles.aiTag}>
                    <Text style={styles.aiTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {aiData.improvements.length > 0 && (
            <View style={styles.aiCard}>
              <Text style={styles.aiTitle}>Suggested Improvements</Text>
              <View style={styles.improvementsList}>
                {aiData.improvements.map((improvement, i) => (
                  <View key={i} style={styles.improvementItem}>
                    <Text style={styles.improvementBullet}>•</Text>
                    <Text style={styles.improvementText}>{improvement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.aiActionPane}>
          <Pressable
            style={[
              styles.aiBtn,
              (!apiKey || isLoading) && styles.aiBtnDisabled,
            ]}
            onPress={handleAiResponse}
            disabled={!apiKey || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.dark.background} size="small" />
            ) : (
              <Text style={styles.aiBtnText}>Enhance with AI</Text>
            )}
          </Pressable>

          {!apiKey && (
            <Text style={styles.hintText}>
              Add your Gemini API key in Settings before generating AI insights.
            </Text>
          )}

          {aiError && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{aiError}</Text>
            </View>
          )}
        </View>
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
  loaderPane: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xxl,
  },
  loaderText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.lg,
  },
  centeredPane: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  backButtonText: {
    ...Typography.button,
    color: Colors.dark.background,
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
    backgroundColor: Colors.dark.backgroundSelected,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  aiBtnDisabled: {
    opacity: 0.6,
  },
  aiBtnText: {
    ...Typography.button,
    color: Colors.dark.background,
  },
  aiActionPane: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  hintText: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
  },
  errorCard: {
    backgroundColor: `${Colors.dark.danger}10`,
    borderWidth: 1,
    borderColor: Colors.dark.danger,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  errorText: {
    ...Typography.label,
    color: `${Colors.dark.text}`,
  },
  aiContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  aiCard: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.dark.accent,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  aiTitle: {
    ...Typography.h4,
    color: Colors.dark.accent,
    marginBottom: Spacing.md,
  },
  aiSummaryText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  aiTag: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginRight: Spacing.md,
    marginBottom: Spacing.md,
  },
  aiTagText: {
    ...Typography.label,
    color: Colors.dark.background,
  },
  improvementsList: {
    gap: Spacing.md,
  },
  improvementItem: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  improvementBullet: {
    ...Typography.body,
    color: Colors.dark.accent,
    fontWeight: "bold",
  },
  improvementText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 21,
  },
});
