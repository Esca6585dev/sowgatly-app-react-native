import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import { colors, radius, spacing, typography } from '../theme';

const STATUS_LABELS = {
  pending: 'Garaşylýar',
  processing: 'Taýýarlanýar',
  completed: 'Tamamlandy',
  cancelled: 'Ýatyryldy',
};

const STATUS_COLORS = {
  pending: colors.warning,
  processing: colors.accent,
  completed: colors.success,
  cancelled: colors.danger,
};

const OrderRow = ({ order }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.orderId}>Sargyt #{order.id}</Text>
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[order.status] || colors.textMuted }]}>
        <Text style={styles.statusText}>{STATUS_LABELS[order.status] || order.status}</Text>
      </View>
    </View>
    <Text style={styles.itemsCount}>{order.items?.length || 0} haryt</Text>
    <View style={styles.cardFooter}>
      <Text style={styles.date}>
        {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : ''}
      </Text>
      <Text style={styles.total}>{Math.floor(order.total_amount)} TMT</Text>
    </View>
  </View>
);

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const json = await apiRequest('/orders');
      setOrders(Array.isArray(json) ? json : json.data || []);
    } catch (error) {
      console.error('Orders API error:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Sargytlarym</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={56} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Sargydyňyz ýok</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <OrderRow order={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  list: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  orderId: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  statusText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.textInverse,
  },
  itemsCount: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  total: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
