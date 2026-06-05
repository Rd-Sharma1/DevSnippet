import { Colors, Spacing, Typography } from '@/constants/theme'
import { snippetDataType } from '@/database/snippetQueries'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Pressable, StyleSheet, Text } from 'react-native'
import SnippetCard from './SnippetCard'

const ListSnippets = ({data}: {data : snippetDataType[]}) => {

  return (
    <FlatList
     data = {data}
        keyExtractor={(item) => item.id?.toString() ?? item.title}
        renderItem={({item}) => (
            <Pressable onPress={() => router.push(`/snippet/${item.id}`)}>
                        <SnippetCard snippet={item} />
            </Pressable>
    )}
    ListEmptyComponent={<Text style={styles.emptyText}>No snippets found.</Text>}
    contentContainerStyle={styles.container}
    />
  )
}

export default ListSnippets

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
})
