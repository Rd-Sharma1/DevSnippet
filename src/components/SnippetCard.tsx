import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme'
import { snippetDataType } from '@/database/snippetQueries'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const SnippetCard = ( {snippet}: {snippet: snippetDataType} ) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{snippet.title}</Text>
      {snippet.description && (
        <Text style={styles.description}>{snippet.description}</Text>
      )}
      <View style={styles.codeContainer}>
        <Text style={styles.code} numberOfLines={3} ellipsizeMode='tail'>
          {snippet.code}
        </Text>
      </View>
      <View style={styles.footer}>
        {snippet.language && (
          <Text style={styles.language}>{snippet.language}</Text>
        )}
        {snippet.isFavorite === 1 && (
          <Text style={styles.favorite}>★ Favorite</Text>
        )}
      </View>
    </View>
  )
}

export default SnippetCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surfaceAlt,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  title: {
    ...Typography.body,
    color: Colors.dark.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.md,
  },
  codeContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.accent,
  },
  code: {
    ...Typography.code,
    color: Colors.dark.textSecondary,
    fontFamily: 'monospace',
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  language: {
    ...Typography.label,
    color: Colors.dark.accent,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  favorite: {
    ...Typography.label,
    color: Colors.dark.warning,
    backgroundColor: `${Colors.dark.warning}15`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
})
