import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { API_URL, apiRequest } from '../config/api'
import { colors, radius, spacing, typography } from '../theme'

const CartItemRow = ({ item }) => (
  <View style={styles.itemRow}>
    <Image
      style={styles.itemImage}
      source={{ uri: `${API_URL}/${item.product?.images?.[0]?.url}` }}
    />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
      <Text style={styles.itemQty}>{item.quantity} sany</Text>
    </View>
    <Text style={styles.itemPrice}>{Math.floor((item.product?.price || 0) * item.quantity)} TMT</Text>
  </View>
);

const Cart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const json = await apiRequest('/cart');
      setItems(json.cart?.items || []);
      setTotal(json.total_amount || 0);
    } catch (error) {
      console.error('Cart API error:', error);
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!items.length) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="cart-outline" size={56} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Sebediňiz boş</Text>
        <Text style={styles.emptySubtitle}>Halan zatlaryňyzy sebede goşuň</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Jemi</Text>
        <Text style={styles.totalValue}>{Math.floor(total)} TMT</Text>
      </View>
    </SafeAreaView>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  list: {
    padding: spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  itemQty: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: typography.size.md,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
})
