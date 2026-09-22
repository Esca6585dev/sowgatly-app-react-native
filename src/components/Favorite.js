import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import ProductCard from './ProductCard'
import { useFavorites } from '../context/FavoritesContext'
import { colors, spacing, typography } from '../theme'

const GAP = spacing.md;
const SCREEN_PADDING = spacing.lg;
const CARD_WIDTH = (Dimensions.get('window').width - SCREEN_PADDING * 2 - GAP) / 2;

const Favorite = () => {
  const navigation = useNavigation();
  const { products, isLoading, isFavorite, toggleFavorite, refresh } = useFavorites();
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      {isLoading && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="heart-outline" size={56} color={colors.textMuted} />
          <Text style={styles.title}>{t('favorites.emptyTitle')}</Text>
          <Text style={styles.subtitle}>{t('favorites.emptySubtitle')}</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
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
  )
}

export default Favorite

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
})
