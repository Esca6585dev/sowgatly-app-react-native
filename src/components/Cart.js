import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { API_URL, apiRequest } from '../config/api'
import CustomButton from './CustomButton'
import { localize, discountedPrice } from '../utils/localize'
import { colors, radius, spacing, typography } from '../theme'

const CartItemRow = ({ item, busy, onChangeQuantity, onRemove }) => {
  const { t, i18n } = useTranslation();
  const imageUrl = item.product?.images?.[0]?.url;
  const stock = item.product?.stock;
  const atMax = stock !== null && stock !== undefined && item.quantity >= stock;

  return (
    <View style={styles.itemRow}>
      {imageUrl ? (
        <Image style={styles.itemImage} source={{ uri: `${API_URL}/${imageUrl}` }} />
      ) : (
        <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
          <Ionicons name="gift-outline" size={24} color={colors.textMuted} />
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {localize(item.product, 'name', i18n.language) || t('common.product')}
        </Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => (item.quantity > 1 ? onChangeQuantity(item, item.quantity - 1) : onRemove(item))}
            disabled={busy}
          >
            <Ionicons name={item.quantity > 1 ? 'remove' : 'trash-outline'} size={16} color={item.quantity > 1 ? colors.text : colors.danger} />
          </TouchableOpacity>
          <Text style={styles.itemQty}>{item.quantity} {t('common.pcs')}</Text>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => onChangeQuantity(item, item.quantity + 1)}
            disabled={busy || atMax}
          >
            <Ionicons name="add" size={16} color={atMax ? colors.border : colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemPrice}>{discountedPrice(item.product) * item.quantity} TMT</Text>
        <TouchableOpacity onPress={() => onRemove(item)} disabled={busy} style={styles.removeButton}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Cart = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [busyItemId, setBusyItemId] = useState(null);

  const applyCart = (json) => {
    setItems(json.cart?.items || []);
    setTotal(json.total_amount || 0);
  };

  const changeQuantity = async (item, quantity) => {
    setBusyItemId(item.id);
    try {
      applyCart(await apiRequest(`/cart/items/${item.id}`, { method: 'PUT', body: { quantity } }));
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('common.genericError'));
    } finally {
      setBusyItemId(null);
    }
  };

  const removeItem = async (item) => {
    setBusyItemId(item.id);
    try {
      applyCart(await apiRequest(`/cart/items/${item.id}`, { method: 'DELETE' }));
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('common.genericError'));
    } finally {
      setBusyItemId(null);
    }
  };

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      applyCart(await apiRequest('/cart'));
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
      <SafeAreaView edges={['left', 'right']} style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!items.length) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.center}>
        <Ionicons name="cart-outline" size={56} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>{t('cart.emptyTitle')}</Text>
        <Text style={styles.emptySubtitle}>{t('cart.emptySubtitle')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            busy={busyItemId === item.id}
            onChangeQuantity={changeQuantity}
            onRemove={removeItem}
          />
        )}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalValue}>{Math.floor(total)} TMT</Text>
        </View>
        <CustomButton
          text={t('cart.order')}
          onPress={() => navigation.navigate('Checkout', { items, total })}
        />
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
  itemImagePlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepButton: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemQty: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: typography.size.xs,
    color: colors.text,
  },
  itemRight: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
