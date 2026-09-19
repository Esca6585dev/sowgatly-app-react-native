import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../config/api';
import { colors, radius, spacing, typography } from '../theme';

const getDiscountedPrice = (price, discount) => {
  return Math.floor(price - (price * discount) / 100);
};

const ProductCard = ({ product, onPress, isFavorite, onToggleFavorite, cardWidth = 150 }) => {
  const { i18n } = useTranslation();
  const name = product.name?.[i18n.language] || product.name?.tm || '';

  return (
    <TouchableOpacity style={[styles.container, { width: cardWidth }]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: `${API_URL}/${product.images?.[0]?.url}` }}
          resizeMode="cover"
        />
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={14}
              color={isFavorite ? colors.danger : colors.text}
            />
          </TouchableOpacity>
        )}
        {!!product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{product.discount}%</Text>
          </View>
        )}
      </View>

      <Text style={styles.name} numberOfLines={2}>{name}</Text>

      {product.shop?.name && (
        <Text style={styles.shopName} numberOfLines={1}>{product.shop.name}</Text>
      )}

      <View style={styles.priceRow}>
        {product.discount ? (
          <>
            <Text style={styles.price}>{getDiscountedPrice(product.price, product.discount)} TMT</Text>
            <Text style={styles.oldPrice}>{Math.floor(product.price)} TMT</Text>
          </>
        ) : (
          <Text style={styles.price}>{Math.floor(product.price)} TMT</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    marginBottom: spacing.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  discountBadgeText: {
    color: colors.textInverse,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  name: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
    marginTop: spacing.sm,
  },
  shopName: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  price: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  oldPrice: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    textDecorationLine: 'line-through',
  },
});
