import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { insertSnippet, snippetDataType } from "@/database/snippetQueries";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateSnippetsScreen = () => {
  const [snippetData, setSnippetData] = useState<snippetDataType>({
    title: "",
    description: "",
    code: "",
    language: "",
    tags: "",
    isFavorite: 0,
    aiSummary: "",
  });

  const handleSaveSnippet = () => {
    if (!snippetData.title.trim() || !snippetData.code.trim()) {
      alert("Title and Code are required");
      return;
    }
    insertSnippet(
      snippetData.title,
      snippetData.description || "",
      snippetData.code,
      snippetData.language || "",
      snippetData.tags || "",
      snippetData.isFavorite || 0,
      snippetData.aiSummary || ""
    );
    setSnippetData({
      title: "",
      description: "",
      code: "",
      language: "",
      tags: "",
      isFavorite: 0,
      aiSummary: "",
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.title}>New Snippet</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Snippet title"
            placeholderTextColor={Colors.dark.textTertiary}
            value={snippetData.title}
            onChangeText={(text) =>
              setSnippetData((prev) => ({ ...prev, title: text }))
            }
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description"
            placeholderTextColor={Colors.dark.textTertiary}
            value={snippetData.description}
            onChangeText={(text) =>
              setSnippetData((prev) => ({ ...prev, description: text }))
            }
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Code *</Text>
          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="Paste your code here"
            placeholderTextColor={Colors.dark.textTertiary}
            multiline
            value={snippetData.code}
            onChangeText={(text) =>
              setSnippetData((prev) => ({ ...prev, code: text }))
            }
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Language</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., JavaScript"
              placeholderTextColor={Colors.dark.textTertiary}
              value={snippetData.language}
              onChangeText={(text) =>
                setSnippetData((prev) => ({ ...prev, language: text }))
              }
            />
          </View>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Tags</Text>
            <TextInput
              style={styles.input}
              placeholder="comma, separated"
              placeholderTextColor={Colors.dark.textTertiary}
              value={snippetData.tags}
              onChangeText={(text) =>
                setSnippetData((prev) => ({ ...prev, tags: text }))
              }
            />
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSaveSnippet}>
          <Ionicons name="checkmark" size={20} color={Colors.dark.background} />
          <Text style={styles.saveButtonText}>Save Snippet</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateSnippetsScreen;

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
    ...Typography.h3,
    color: Colors.dark.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    ...Typography.label,
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.dark.surfaceAlt,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.dark.text,
  },
  codeInput: {
    minHeight: 120,
    textAlignVertical: "top",
    fontFamily: "monospace",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: Colors.dark.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.dark.background,
  },
});

