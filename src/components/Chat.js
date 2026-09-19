import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors, spacing, typography } from '../theme'

const Chat = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="chatbubble-ellipses-outline" size={56} color={colors.textMuted} />
      <Text style={styles.title}>Habarlaşma ýok</Text>
      <Text style={styles.subtitle}>Sargydyňyz baradaky habarlar şu ýerde görkeziler</Text>
    </SafeAreaView>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
})
