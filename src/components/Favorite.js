import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors, spacing, typography } from '../theme'

// There's no wishlist endpoint on the backend yet (products only support a
// local, per-screen "favorite" toggle), so this tab can't show real saved
// items. Once a `/favorites` API exists, fetch it here and render the
// results with <ProductCard />, the same component Products.js uses.
const Favorite = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="heart-outline" size={56} color={colors.textMuted} />
      <Text style={styles.title}>Halananlar boş</Text>
      <Text style={styles.subtitle}>Önümleriň ýanyndaky ýürejige basyp, halan zatlaryňyzy şu ýere goşuň</Text>
    </SafeAreaView>
  )
}

export default Favorite

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
