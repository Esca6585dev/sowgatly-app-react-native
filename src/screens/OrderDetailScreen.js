import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_URL, apiRequest } from '../config/api';
import { localize } from '../utils/localize';
import { formatDate, formatDateTime, STATUS_COLORS } from './OrdersScreen';
import { colors, radius, spacing, typography } from '../theme';

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.infoIcon} />
    <View style={styles.infoBody}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState(route.params?.order || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const orderId = route.params?.orderId ?? route.params?.order?.id;

  useEffect(() => {
    let active = true;
    apiRequest(`/orders/${orderId}`)
      .then((json) => { if (active) setOrder(json.data || json); })
      .catch((e) => { if (active) setError(e.message || t('common.genericError')); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [orderId]);

  const lang = i18n.language;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('orders.order', { id: orderId })}</Text>
        <View style={styles.backButton} />
      </View>

      {!order && isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : !order ? (
        <View style={styles.center}><Text style={styles.muted}>{error}</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] || colors.textMuted }]}>
              <Text style={styles.statusText}>{t(`orders.status.${order.status}`, { defaultValue: order.status })}</Text>
            </View>
            <Text style={styles.muted}>{formatDate(order.created_at, lang)}</Text>
          </View>

          <View style={styles.card}>
            {order.shop?.name ? <InfoRow icon="storefront-outline" label={t('product.shop')} value={order.shop.name} /> : null}
            {order.delivery_address ? (
              <InfoRow icon="location-outline" label={t('checkout.address')} value={order.delivery_address} />
            ) : null}
            <InfoRow
              icon="time-outline"
              label={t('checkout.deliveryTime')}
              value={order.delivery_type === 'scheduled' && order.scheduled_at
                ? formatDateTime(order.scheduled_at, lang)
                : t('checkout.asap')}
            />
            {order.recipient_phone ? (
              <InfoRow icon="call-outline" label={t('checkout.recipientPhone')} value={order.recipient_phone} />
            ) : null}
            {order.note ? <InfoRow icon="chatbox-ellipses-outline" label={t('orders.note')} value={order.note} /> : null}
          </View>

          <Text style={styles.sectionTitle}>{t('common.items', { count: order.items?.length || 0 })}</Text>
          <View style={styles.card}>
            {(order.items || []).map((item) => {
              const imageUrl = item.product?.images?.[0]?.url;
              return (
                <View key={item.id} style={styles.itemRow}>
                  {imageUrl ? (
                    <Image style={styles.itemImage} source={{ uri: `${API_URL}/${imageUrl}` }} />
                  ) : (
                    <View style={[styles.itemImage, styles.placeholder]}>
                      <Ionicons name="gift-outline" size={20} color={colors.textMuted} />
                    </View>
                  )}
                  <View style={styles.itemBody}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {localize(item.product, 'name', lang) || t('common.product')}
                    </Text>
                    <Text style={styles.muted}>{item.quantity} × {Math.floor(item.price)} TMT</Text>
                  </View>
                  <Text style={styles.itemTotal}>{Math.floor(item.price * item.quantity)} TMT</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('cart.total')}</Text>
            <Text style={styles.totalValue}>{Math.floor(order.total_amount)} TMT</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrderDetailScreen;

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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  content: { padding: spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm },
  statusText: { fontSize: typography.size.xs, fontWeight: typography.weight.semibold, color: colors.textInverse },
  muted: { fontSize: typography.size.sm, color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', paddingVertical: spacing.sm },
  infoIcon: { marginRight: spacing.md, marginTop: 2 },
  infoBody: { flex: 1 },
  infoLabel: { fontSize: typography.size.xs, color: colors.textMuted },
  infoValue: { fontSize: typography.size.md, color: colors.text, marginTop: 2 },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  itemImage: { width: 48, height: 48, borderRadius: radius.sm, marginRight: spacing.md },
  placeholder: { backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  itemBody: { flex: 1 },
  itemName: { fontSize: typography.size.sm, fontWeight: typography.weight.medium, color: colors.text },
  itemTotal: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.text, marginLeft: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: typography.size.md, color: colors.textMuted },
  totalValue: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.text },
});
