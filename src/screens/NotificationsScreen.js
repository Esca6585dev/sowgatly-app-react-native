import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import { formatDateTime, STATUS_COLORS } from './OrdersScreen';
import { colors, radius, spacing, typography } from '../theme';

export const notificationText = (n, t) => {
  const id = n.data?.order_id;
  if (n.type === 'order_created') return t('notifications.orderCreated', { id });
  if (n.type === 'order_status') {
    const status = t(`orders.status.${n.data?.status}`, { defaultValue: n.data?.status });
    return t('notifications.orderStatus', { id, status });
  }
  return n.type;
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const json = await apiRequest('/me/notifications');
      setItems(json.data || []);
      // Opening the list counts as reading them; unread ones stay
      // highlighted until the next visit.
      if (json.meta?.unread) {
        apiRequest('/me/notifications/read', { method: 'POST' }).catch(() => {});
      }
    } catch (e) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (isLoading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={items.length === 0 ? styles.center : styles.list}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
      ListEmptyComponent={
        <View style={styles.emptyBox}>
          <Ionicons name="notifications-off-outline" size={56} color={colors.textMuted} />
          <Text style={styles.title}>{t('notifications.empty')}</Text>
        </View>
      }
      renderItem={({ item }) => {
        const status = item.data?.status;
        return (
          <TouchableOpacity
            style={[styles.row, !item.read_at && styles.unread]}
            onPress={() => item.data?.order_id && navigation.navigate('OrderDetail', { orderId: item.data.order_id })}
          >
            <View style={[styles.dot, { backgroundColor: STATUS_COLORS[status] || colors.accent }]} />
            <View style={styles.body}>
              <Text style={styles.text}>{notificationText(item, t)}</Text>
              <Text style={styles.time}>{formatDateTime(item.created_at, i18n.language)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.xl },
  emptyBox: { alignItems: 'center' },
  title: { fontSize: typography.size.lg, fontWeight: typography.weight.semibold, color: colors.text, marginTop: spacing.md },
  list: { padding: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unread: { backgroundColor: colors.surface, borderColor: colors.accentMuted },
  dot: { width: 10, height: 10, borderRadius: 5 },
  body: { flex: 1 },
  text: { fontSize: typography.size.sm, color: colors.text, lineHeight: 20 },
  time: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
});
