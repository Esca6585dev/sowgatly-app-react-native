import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_URL, apiRequest } from '../config/api';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { imageUri, localize } from '../utils/localize';
import { colors, radius, spacing, typography } from '../theme';

const GAP = spacing.md;
const SCREEN_PADDING = spacing.lg;
const CARD_WIDTH = (Dimensions.get('window').width - SCREEN_PADDING * 2 - GAP) / 2;

const hours = (open, close) => (open && close ? `${String(open).slice(0, 5)} – ${String(close).slice(0, 5)}` : null);

const ShopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t, i18n } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const shopId = route.params?.shopId ?? route.params?.shop?.id;

  const [shop, setShop] = useState(route.params?.shop || null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest(`/shops/${shopId}`)
      .then((json) => json.data && setShop(json.data))
      .catch(() => {});
  }, [shopId]);

  const loadProducts = useCallback(async (nextPage) => {
    setIsLoading(true);
    try {
      const json = await apiRequest(`/product/search?shop_id=${shopId}&page=${nextPage}`);
      const items = json.data || [];
      setProducts((prev) => (nextPage === 1 ? items : [...prev, ...items]));
      setPage(json.meta?.current_page || nextPage);
      setLastPage(json.meta?.last_page || nextPage);
    } catch (e) {
      if (nextPage === 1) setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  useEffect(() => { loadProducts(1); }, [loadProducts]);

  const avatar = imageUri(shop?.image, API_URL);
  const weekdayHours = hours(shop?.mon_fri_open, shop?.mon_fri_close);
  const weekendHours = hours(shop?.sat_sun_open, shop?.sat_sun_close);
  const region = shop?.region ? localize(shop.region, 'name', i18n.language) : '';

  const header = (
    <View style={styles.shopCard}>
      {avatar ? (
        <Image style={styles.avatar} source={{ uri: avatar }} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Ionicons name="storefront-outline" size={28} color={colors.textMuted} />
        </View>
      )}
      <Text style={styles.shopName}>{shop?.name}</Text>
      {region || shop?.address ? (
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>{[region, shop?.address].filter(Boolean).join(', ')}</Text>
        </View>
      ) : null}
      {weekdayHours ? (
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>{t('shop.weekdays')}: {weekdayHours}</Text>
        </View>
      ) : null}
      {weekendHours ? (
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>{t('shop.weekend')}: {weekendHours}</Text>
        </View>
      ) : null}
      <Text style={styles.sectionTitle}>{t('shop.products')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{shop?.name || t('product.shop')}</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        onEndReached={() => { if (!isLoading && page < lastPage) loadProducts(page + 1); }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={isLoading ? null : <Text style={styles.empty}>{t('collection.empty')}</Text>}
        ListFooterComponent={isLoading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : null}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            cardWidth={CARD_WIDTH}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
            onPress={() => navigation.push('ProductDetail', { data: item })}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ShopScreen;

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
  list: { paddingHorizontal: SCREEN_PADDING, paddingBottom: spacing.xl },
  row: { justifyContent: 'space-between' },
  shopCard: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  avatarPlaceholder: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  shopName: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  meta: { fontSize: typography.size.sm, color: colors.textMuted },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginTop: spacing.xl,
  },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
  loader: { marginVertical: spacing.lg },
});
