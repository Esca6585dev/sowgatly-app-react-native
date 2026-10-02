import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../config/api';
import Stars from './Stars';
import { formatDate } from '../screens/OrdersScreen';
import { colors, radius, spacing, typography } from '../theme';

const VISIBLE = 5;

const ProductReviews = ({ productId }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Refetch on focus so a review written on the form screen shows up.
  useFocusEffect(
    useCallback(() => {
      apiRequest(`/products/${productId}/reviews`)
        .then((json) => { setReviews(json.data || []); setMeta(json.meta || null); })
        .catch(() => {});
    }, [productId])
  );

  if (!meta) return null;

  const shown = showAll ? reviews : reviews.slice(0, VISIBLE);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('Ratings and reviews')}</Text>

      <View style={styles.summary}>
        <Text style={styles.average}>{meta.average ?? '–'}</Text>
        <View>
          <Stars value={meta.average || 0} size={18} />
          <Text style={styles.muted}>{t('reviews.count', { count: meta.count })}</Text>
        </View>
      </View>

      {meta.can_review && (
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => navigation.navigate('ReviewForm', { productId, review: meta.my_review })}
        >
          <Text style={styles.writeText}>{meta.my_review ? t('reviews.edit') : t('reviews.write')}</Text>
        </TouchableOpacity>
      )}

      {reviews.length === 0 ? (
        <Text style={styles.muted}>{t('reviews.none')}</Text>
      ) : (
        shown.map((review) => (
          <View key={review.id} style={styles.review}>
            <View style={styles.reviewHeader}>
              <Text style={styles.author}>{review.author || t('common.user')}</Text>
              <Text style={styles.muted}>{formatDate(review.created_at, i18n.language)}</Text>
            </View>
            <Stars value={review.rating} size={14} />
            {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
          </View>
        ))
      )}

      {!showAll && reviews.length > VISIBLE && (
        <TouchableOpacity onPress={() => setShowAll(true)}>
          <Text style={styles.more}>{t('reviews.showAll', { count: reviews.length })}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductReviews;

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  average: { fontSize: 36, fontWeight: typography.weight.bold, color: colors.text },
  muted: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
  writeButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  writeText: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.text },
  review: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.text },
  comment: { fontSize: typography.size.sm, color: colors.text, lineHeight: 20 },
  more: { color: colors.accent, fontWeight: typography.weight.semibold, fontSize: typography.size.sm, marginTop: spacing.sm },
});
