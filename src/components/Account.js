import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAuth } from '../context/AuthContext'
import CustomButton from './CustomButton'
import { colors, radius, spacing, typography } from '../theme'

const MenuRow = ({ icon, label }) => (
  <View style={styles.menuRow}>
    <Ionicons name={icon} size={20} color={colors.text} style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
  </View>
);

const Account = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.textInverse} />
          </View>
          <Text style={styles.name}>{user?.name || 'Ulanyjy'}</Text>
          <Text style={styles.phone}>{user?.phone_number}</Text>
        </View>

        <View style={styles.menu}>
          <MenuRow icon="receipt-outline" label="Sargytlarym" />
          <MenuRow icon="location-outline" label="Salgylarym" />
          <MenuRow icon="heart-outline" label="Halananlarym" />
          <MenuRow icon="settings-outline" label="Sazlamalar" />
        </View>

        <CustomButton text="Ulgamdan çyk" type="SECONDARY" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Account

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  phone: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  menu: {
    marginBottom: spacing.xxl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text,
  },
})
