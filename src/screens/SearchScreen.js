import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Dimensions,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { localize } from '../utils/localize';
import { colors, radius, spacing, typography } from '../theme';

const GAP = spacing.md;
const SCREEN_PADDING = spacing.lg;
const CARD_WIDTH = (Dimensions.get('window').width - SCREEN_PADDING * 2 - GAP) / 2;
const SORTS = ['newest', 'price_asc', 'price_desc'];

const EMPTY_FILTERS = { sort: 'newest', minPrice: '', maxPrice: '', categoryId: null, shopId: null };

const buildQuery = (text, filters, page) => {
  const params = [`page=${page}`];
  if (text.trim()) params.push(`name=${encodeURIComponent(text.trim())}`);
  if (filters.minPrice) params.push(`min_price=${encodeURIComponent(filters.minPrice)}`);
  if (filters.maxPrice) params.push(`max_price=${encodeURIComponent(filters.maxPrice)}`);
  if (filters.categoryId) params.push(`category_id=${filters.categoryId}`);
  if (filters.shopId) params.push(`shop_id=${filters.shopId}`);
  if (filters.sort && filters.sort !== 'newest') params.push(`sort=${filters.sort}`);
  return `/product/search?${params.join('&')}`;
};

const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t, i18n } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [text, setText] = useState(route.params?.query || '');
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, ...(route.params?.filters || {}) });
  const [showFilters, setShowFilters] = useState(!!route.params?.openFilters);
  const [categories, setCategories] = useState([]);

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const activeFilterCount =
    (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) +
    (filters.categoryId ? 1 : 0) + (filters.sort !== 'newest' ? 1 : 0);

  useEffect(() => {
    apiRequest('/categories')
      .then((json) => setCategories(json.data || []))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async (nextPage) => {
    const id = ++requestId.current;
    setIsLoading(true);
    setError('');
    try {
      const json = await apiRequest(buildQuery(text, filters, nextPage));
      if (id !== requestId.current) return; // a newer search replaced this one
      const items = json.data || [];
      setResults((prev) => (nextPage === 1 ? items : [...prev, ...items]));
      setPage(json.meta?.current_page || nextPage);
      setLastPage(json.meta?.last_page || nextPage);
      setTotal(json.meta?.total ?? items.length);
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e.message || t('common.genericError'));
      if (nextPage === 1) setResults([]);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [text, filters, t]);

  // Debounce typing; filter changes go through the same path.
  useEffect(() => {
    const timer = setTimeout(() => load(1), 350);
    return () => clearTimeout(timer);
  }, [load]);

  const loadMore = () => {
    if (!isLoading && page < lastPage) load(page + 1);
  };

  const updateFilter = (patch) => setFilters((prev) => ({ ...prev, ...patch }));
  const onlyDigits = (value) => value.replace(/[^0-9]/g, '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.inputBlock}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={t('Search by products')}
            placeholderTextColor={colors.textMuted}
            autoFocus={!route.params?.openFilters}
            returnKeyType="search"
          />
          {text ? (
            <TouchableOpacity onPress={() => setText('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters((v) => !v)}
          style={[styles.iconButton, styles.filterButton, showFilters && styles.filterButtonActive]}
        >
          <Ionicons name="options-outline" size={20} color={showFilters ? colors.textInverse : colors.text} />
          {activeFilterCount > 0 && (
            <View style={styles.badge}><Text style={styles.badgeText}>{activeFilterCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filters}>
          <Text style={styles.filterLabel}>{t('search.sort')}</Text>
          <View style={styles.chipRow}>
            {SORTS.map((sort) => (
              <Chip
                key={sort}
                label={t(`search.sorts.${sort}`)}
                active={filters.sort === sort}
                onPress={() => updateFilter({ sort })}
              />
            ))}
          </View>

          <Text style={styles.filterLabel}>{t('search.price')}</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              value={filters.minPrice}
              onChangeText={(v) => updateFilter({ minPrice: onlyDigits(v) })}
              placeholder={t('search.minPrice')}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
            <Text style={styles.priceDash}>—</Text>
            <TextInput
              style={styles.priceInput}
              value={filters.maxPrice}
              onChangeText={(v) => updateFilter({ maxPrice: onlyDigits(v) })}
              placeholder={t('search.maxPrice')}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
            <Text style={styles.currency}>TMT</Text>
          </View>

          <Text style={styles.filterLabel}>{t('search.category')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <Chip label={t('search.all')} active={!filters.categoryId} onPress={() => updateFilter({ categoryId: null })} />
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={localize(c, 'name', i18n.language)}
                active={filters.categoryId === c.id}
                onPress={() => updateFilter({ categoryId: c.id })}
              />
            ))}
          </ScrollView>

          {activeFilterCount > 0 && (
            <TouchableOpacity
              onPress={() => setFilters({ ...EMPTY_FILTERS, shopId: filters.shopId })}
              style={styles.resetButton}
            >
              <Text style={styles.resetText}>{t('search.reset')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : isLoading && results.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>{t('search.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={<Text style={styles.count}>{t('search.found', { count: total })}</Text>}
          ListFooterComponent={isLoading ? <ActivityIndicator style={styles.footerLoader} color={colors.primary} /> : null}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              cardWidth={CARD_WIDTH}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item)}
              onPress={() => navigation.navigate('ProductDetail', { data: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  filterButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  badge: {
    position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: colors.textInverse, fontSize: 10, fontWeight: typography.weight.bold },
  inputBlock: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, fontSize: typography.size.sm, color: colors.text },
  filters: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.size.sm, color: colors.text },
  chipTextActive: { color: colors.textInverse, fontWeight: typography.weight.semibold },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: typography.size.sm,
    color: colors.text,
  },
  priceDash: { color: colors.textMuted },
  currency: { color: colors.textMuted, fontSize: typography.size.sm },
  resetButton: { alignSelf: 'flex-start', marginTop: spacing.md },
  resetText: { color: colors.accent, fontWeight: typography.weight.semibold, fontSize: typography.size.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyText: { marginTop: spacing.md, color: colors.textMuted, fontSize: typography.size.sm, textAlign: 'center' },
  list: { paddingHorizontal: SCREEN_PADDING, paddingBottom: spacing.xl },
  row: { justifyContent: 'space-between' },
  count: { fontSize: typography.size.sm, color: colors.textMuted, marginVertical: spacing.md },
  footerLoader: { marginVertical: spacing.lg },
});
