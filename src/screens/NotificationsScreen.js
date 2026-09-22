import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';

const NotificationsScreen = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Ionicons name="notifications-off-outline" size={56} color={colors.textMuted} />
      <Text style={styles.title}>{t('notifications.empty')}</Text>
    </View>
  );
};

export default NotificationsScreen;

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
});
