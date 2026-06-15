import {
  Colors,
  Radius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import { useApiKey } from "@/hooks/use-api-key";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsTab = () => {
  const { apiKey, isLoading, saveApiKey, clearApiKey } = useApiKey();
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const testApiKey = async () => {
    const keyToTest = inputKey || apiKey;

    if (!keyToTest) {
      Alert.alert("Error", "Please enter an API key first.");
      return;
    }

    setIsTestingKey(true);
    setTestStatus("idle");

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": keyToTest,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Say 'API key is valid'",
                  },
                ],
              },
            ],
          }),
        },
      );

      if (response.ok) {
        setTestStatus("success");
        Alert.alert("Success", "API key is valid! ✓");
      } else {
        setTestStatus("error");
        Alert.alert("Error", "API key is invalid. Please check and try again.");
      }
    } catch (_) {
      setTestStatus("error");
      Alert.alert("Error", "Failed to test API key. Check your connection.");
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleSaveKey = async () => {
    if (!inputKey.trim()) {
      Alert.alert("Error", "Please enter an API key.");
      return;
    }

    setIsSaving(true);
    const success = await saveApiKey(inputKey.trim());

    if (success) {
      setInputKey("");
      Alert.alert("Success", "API key saved securely.");
      setTestStatus("idle");
    } else {
      Alert.alert("Error", "Failed to save API key. Please try again.");
    }
    setIsSaving(false);
  };

  const handleClearKey = () => {
    Alert.alert(
      "Clear API Key",
      "Remove the stored Gemini API key from this device? The app will no longer be able to generate AI suggestions until a new key is configured.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: async () => {
            await clearApiKey();
            setInputKey("");
            setTestStatus("idle");
            Alert.alert("Success", "API key cleared.");
          },
          style: "destructive",
        },
      ],
    );
  };

  const hasStoredKey = !!apiKey;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderPane}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
          <Text style={styles.loaderText}>Loading secure settings…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="key" size={24} color={Colors.dark.accent} />
            <Text style={styles.sectionTitle}>API Configuration</Text>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: hasStoredKey
                        ? Colors.dark.success
                        : Colors.dark.warning,
                    },
                  ]}
                />
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusLabel}>
                  {hasStoredKey
                    ? "API key configured"
                    : "No API key configured"}
                </Text>
                <Text style={styles.statusSubtext}>
                  {hasStoredKey
                    ? "Secure key storage is active."
                    : "Add your Gemini key to use AI features."}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Gemini API Key</Text>
            <Text style={styles.hint}>
              Get your key from <Text style={styles.link}>ai.google.dev</Text>
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Paste your Gemini key"
                placeholderTextColor={Colors.dark.textTertiary}
                secureTextEntry={!showKey}
                value={inputKey}
                onChangeText={setInputKey}
                editable={!isSaving}
              />
              <Pressable
                onPress={() => setShowKey(!showKey)}
                style={styles.toggleButton}
              >
                <Ionicons
                  name={showKey ? "eye" : "eye-off"}
                  size={20}
                  color={Colors.dark.accent}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <Pressable
              style={[styles.button, styles.testButton]}
              onPress={testApiKey}
              disabled={isTestingKey || !inputKey}
            >
              {isTestingKey ? (
                <ActivityIndicator
                  color={Colors.dark.background}
                  size="small"
                />
              ) : (
                <>
                  <Ionicons
                    name="checkbox"
                    size={18}
                    color={Colors.dark.background}
                  />
                  <Text style={styles.buttonText}>Test Key</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveKey}
              disabled={isSaving || !inputKey}
            >
              {isSaving ? (
                <ActivityIndicator
                  color={Colors.dark.background}
                  size="small"
                />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload"
                    size={18}
                    color={Colors.dark.background}
                  />
                  <Text style={styles.buttonText}>Save Key</Text>
                </>
              )}
            </Pressable>
          </View>

          {testStatus === "success" && (
            <View style={[styles.statusMessage, styles.successMessage]}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.dark.success}
              />
              <Text style={styles.successText}>API key is working!</Text>
            </View>
          )}

          {testStatus === "error" && (
            <View style={[styles.statusMessage, styles.errorMessage]}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.dark.danger}
              />
              <Text style={styles.errorText}>API key test failed</Text>
            </View>
          )}

          {hasStoredKey && (
            <Pressable style={styles.clearButton} onPress={handleClearKey}>
              <Ionicons
                name="trash-outline"
                size={18}
                color={Colors.dark.danger}
              />
              <Text style={styles.clearButtonText}>Clear Stored Key</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>AI Provider</Text>
            <Text style={styles.infoValue}>Google Gemini API</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Security</Text>
            <Text style={styles.infoValue}>API keys stored securely</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BYOK (Bring Your Own Key)</Text>
          <View style={styles.helpCard}>
            <Text style={styles.helpText}>
              DevSnippet uses a strict BYOK architecture. Your Gemini key is
              stored only on your device and never falls back to a built-in key.
            </Text>
            <Text style={styles.helpTitle}>Getting Started</Text>
            <Text style={styles.helpText}>
              1. Visit ai.google.dev{"\n"}
              2. Create a Gemini API key{"\n"}
              3. Paste it above and save{"\n"}
              4. Test the key before using AI features
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsTab;

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
    textAlign: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.dark.text,
  },
  section: {
    gap: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.dark.text,
  },
  statusCard: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: `${Colors.dark.accent}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    ...Typography.button,
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  statusSubtext: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
  },
  inputSection: {
    gap: Spacing.md,
  },
  label: {
    ...Typography.button,
    color: Colors.dark.text,
  },
  hint: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
  },
  link: {
    color: Colors.dark.accent,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.lg,
    color: Colors.dark.text,
    ...Typography.body,
  },
  toggleButton: {
    padding: Spacing.md,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  testButton: {
    backgroundColor: Colors.dark.accent,
  },
  saveButton: {
    backgroundColor: Colors.dark.success,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.dark.background,
  },
  statusMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.md,
  },
  successMessage: {
    backgroundColor: `${Colors.dark.success}15`,
    borderWidth: 1,
    borderColor: Colors.dark.success,
  },
  successText: {
    ...Typography.body,
    color: Colors.dark.success,
    fontWeight: "600",
  },
  errorMessage: {
    backgroundColor: `${Colors.dark.danger}15`,
    borderWidth: 1,
    borderColor: Colors.dark.danger,
  },
  errorText: {
    ...Typography.body,
    color: Colors.dark.danger,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.dark.danger,
  },
  clearButtonText: {
    ...Typography.button,
    color: Colors.dark.danger,
  },
  infoCard: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  infoLabel: {
    ...Typography.label,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.sm,
  },
  infoValue: {
    ...Typography.body,
    color: Colors.dark.text,
  },
  helpCard: {
    backgroundColor: `${Colors.dark.accent}10`,
    borderWidth: 1,
    borderColor: Colors.dark.accent,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  helpText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  helpTitle: {
    ...Typography.button,
    color: Colors.dark.accent,
    marginTop: Spacing.md,
  },
});
