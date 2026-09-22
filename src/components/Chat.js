import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { colors, spacing, typography } from '../theme'

const Chat = () => {
  const { t } = useTranslation()

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <Ionicons name="chatbubble-ellipses-outline" size={56} color={colors.textMuted} />
      <Text style={styles.title}>{t('chat.emptyTitle')}</Text>
      <Text style={styles.subtitle}>{t('chat.emptySubtitle')}</Text>
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
