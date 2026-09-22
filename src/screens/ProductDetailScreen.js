import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HorizontalRule from '../components/HorizontalRule'
import BottomButton from '../components/BottomButton'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { API_URL } from '../config/api'
import { useFavorites } from '../context/FavoritesContext'
import { localize, discountedPrice } from '../utils/localize'
import { colors, radius, spacing, typography } from '../theme'

const ProductDetailScreen = ({ route }) => {
  const { data } = route.params
  const images = data.images || []
  const [imageID, changeImage] = useState(0)
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { isFavorite, toggleFavorite } = useFavorites()

  const lang = i18n.language
  const name = localize(data, 'name', lang)
  const description = localize(data, 'description', lang)
  const compositions = (data.compositions || [])
    .map((c) => localize(c, 'name', lang))
    .filter(Boolean)
  const width = data.width || data.attributes?.width
  const height = data.height || data.attributes?.height
  const favorite = isFavorite(data.id)
  const mainImageUrl = images[imageID]?.url

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerImageSection}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.headerButton, styles.headerBackIcon, { top: insets.top + spacing.sm }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleFavorite(data)}
            style={[styles.headerButton, styles.headerFavoriteIcon, { top: insets.top + spacing.sm }]}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={22}
              color={favorite ? colors.danger : colors.text}
            />
          </TouchableOpacity>

          {mainImageUrl ? (
            <Image style={styles.mainImage} source={{ uri: `${API_URL}/${mainImageUrl}` }} />
          ) : (
            <View style={[styles.mainImage, styles.imagePlaceholder]}>
              <Ionicons name="gift-outline" size={64} color={colors.textMuted} />
            </View>
          )}
        </View>

        {images.length > 1 && (
          <ScrollView style={styles.containerImage} horizontal showsHorizontalScrollIndicator={false}>
            {images.map((item, index) => (
              <TouchableOpacity key={item.id ?? index} style={styles.selectImage} onPress={() => changeImage(index)}>
                <Image
                  style={[styles.image, index === imageID && styles.active]}
                  source={{ uri: `${API_URL}/${item.url}` }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.productDetails}>
          <Text style={styles.productName}>{name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{discountedPrice(data)} TMT</Text>
            {!!data.discount && (
              <Text style={styles.oldPrice}>{Math.floor(data.price)} TMT</Text>
            )}
          </View>

          {data.shop?.name ? (
            <View style={styles.shopRow}>
              {data.shop.image ? (
                <Image style={styles.shopAvatar} source={{ uri: `${API_URL}/${data.shop.image}` }} />
              ) : (
                <View style={[styles.shopAvatar, styles.imagePlaceholder]}>
                  <Ionicons name="storefront-outline" size={20} color={colors.textMuted} />
                </View>
              )}
              <View>
                <Text style={styles.shopLabel}>{t('product.shop')}</Text>
                <Text style={styles.shopName}>{data.shop.name}</Text>
              </View>
            </View>
          ) : null}

          <HorizontalRule />

          {compositions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionName}>{t('Composition')}</Text>
              <Text style={styles.sectionText}>{compositions.join(', ')}</Text>
            </View>
          )}

          {(width || height) ? (
            <View style={styles.section}>
              <Text style={styles.sectionName}>{t('Size')}</Text>
              <View style={styles.sizeRow}>
                {width ? (
                  <View style={styles.sizeItem}>
                    <Ionicons name="swap-horizontal" size={16} color={colors.textMuted} />
                    <Text style={styles.sectionText}>{t('product.width')} {width} cm</Text>
                  </View>
                ) : null}
                {height ? (
                  <View style={styles.sizeItem}>
                    <Ionicons name="swap-vertical" size={16} color={colors.textMuted} />
                    <Text style={styles.sectionText}>{t('product.height')} {height} cm</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          {description ? (
            <View style={styles.section}>
              <Text style={styles.sectionName}>{t('Description')}</Text>
              <Text style={styles.sectionText}>{description}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <BottomButton data={data} />
    </SafeAreaView>
  )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerImageSection: {
    position: 'relative',
  },
  headerButton: {
    position: 'absolute',
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackIcon: {
    left: spacing.lg,
  },
  headerFavoriteIcon: {
    right: spacing.lg,
  },
  mainImage: {
    height: 360,
    width: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerImage: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  selectImage: {
    marginRight: spacing.sm,
  },
  image: {
    height: 72,
    width: 72,
    borderRadius: radius.md,
    opacity: 0.5,
  },
  active: {
    opacity: 1,
  },
  productDetails: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  productName: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.sm,
  },
  price: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  oldPrice: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  shopAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  shopLabel: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
  },
  shopName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionText: {
    fontSize: typography.size.md,
    lineHeight: 22,
    color: colors.text,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  sizeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
})
