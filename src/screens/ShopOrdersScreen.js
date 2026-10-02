import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import { localize } from '../utils/localize';
import { formatDateTime, STATUS_COLORS } from './OrdersScreen';
import { colors, radius, spacing, typography } from '../theme';

const NEXT = {
  pending: ['processing', 'cancelled'],
  processing: ['completed', 'cancelled'],
};

const FILTERS = [null, 'pending', 'processing', 'completed', 'cancelled'];

const ShopOrdersScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const json = await apiRequest(`/shop/orders${filter ? `?status=${filter}` : ''}`);
      setOrders(json.data || []);
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('common.genericError'));
    } finally {
      setIsLoading(false);
    }
  }, [filter, t]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const changeStatus = (order, status) => {
    const run = async () => {
      setBusyId(order.id);
      try {
        await apiRequest(`/shop/orders/${order.id}/status`, { method: 'PUT', body: { status } });
        load();
      } catch (e) {
        Alert.alert(t('common.error'), e.message || t('common.genericError'));
      } finally {
        setBusyId(null);
      }
    };

    if (status === 'cancelled') {
      Alert.alert(t('shopOrders.cancelTitle'), t('orders.order', { id: order.id }), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('shopOrders.actions.cancelled'), style: 'destructive', onPress: run },
      ]);
    } else {
      run();
    }
  };

  const lang = i18n.language;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('shopOrders.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f || 'all'}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f ? t(`orders.status.${f}`) : t('search.all')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && orders.length === 0 ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
          ListEmptyComponent={<Text style={styles.empty}>{t('orders.empty')}</Text>}
          renderItem={({ item: order }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>{t('orders.order', { id: order.id })}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] || colors.textMuted }]}>
                  <Text style={styles.badgeText}>{t(`orders.status.${order.status}`)}</Text>
                </View>
              </View>

              <Text style={styles.line}>
                {order.user?.name} · {order.recipient_phone}
              </Text>
              {order.delivery_address ? <Text style={styles.line}>{order.delivery_address}</Text> : null}
              <Text style={styles.muted}>
                {order.delivery_type === 'scheduled' && order.scheduled_at
                  ? formatDateTime(order.scheduled_at, lang)
                  : t('checkout.asap')}
              </Text>
              {order.note ? <Text style={styles.note}>“{order.note}”</Text> : null}

              <View style={styles.items}>
                {(order.items || []).map((item) => (
                  <Text key={item.id} style={styles.item}>
                    {item.quantity} × {localize(item.product, 'name', lang) || t('common.product')}
                  </Text>
                ))}
              </View>
              <Text style={styles.total}>{Math.floor(order.total_amount)} TMT</Text>

              {NEXT[order.status] && (
                <View style={styles.actions}>
                  {NEXT[order.status].map((status) => (
                    <TouchableOpacity
                      key={status}
                      disabled={busyId === order.id}
                      onPress={() => changeStatus(order, status)}
                      style={[styles.action, status === 'cancelled' ? styles.actionDanger : styles.actionPrimary]}
                    >
                      <Text style={[styles.actionText, status === 'cancelled' && styles.actionTextDanger]}>
                        {t(`shopOrders.actions.${status}`)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ShopOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: typography.size.lg, fontWeight: typography.weight.semibold, color: colors.text },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.size.xs, color: colors.text },
  chipTextActive: { color: colors.textInverse, fontWeight: typography.weight.semibold },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.lg },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  orderId: { fontSize: typography.size.md, fontWeight: typography.weight.semibold, color: colors.text },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  badgeText: { fontSize: typography.size.xs, fontWeight: typography.weight.semibold, color: colors.textInverse },
  line: { fontSize: typography.size.sm, color: colors.text },
  muted: { fontSize: typography.size.xs, color: colors.textMuted },
  note: { fontSize: typography.size.sm, color: colors.textMuted, fontStyle: 'italic' },
  items: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  item: { fontSize: typography.size.sm, color: colors.text },
  total: { fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.text, textAlign: 'right' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  action: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1 },
  actionPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  actionDanger: { borderColor: colors.danger, backgroundColor: colors.background },
  actionText: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.textInverse },
  actionTextDanger: { color: colors.danger },
});
