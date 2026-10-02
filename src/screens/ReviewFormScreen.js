import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import Stars from '../components/Stars';
import CustomButton from '../components/CustomButton';
import { colors, radius, spacing, typography } from '../theme';

const ReviewFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { productId, review } = route.params || {};

  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    if (!rating) {
      setError(t('reviews.ratingRequired'));
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await apiRequest(`/products/${productId}/reviews`, {
        method: 'POST',
        body: { rating, comment: comment.trim() || null },
      });
      navigation.goBack();
    } catch (e) {
      setError(e.message || t('common.genericError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{review ? t('reviews.edit') : t('reviews.write')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>{t('reviews.yourRating')}</Text>
        <Stars value={rating} size={36} onChange={(n) => { setRating(n); setError(''); }} />

        <Text style={[styles.label, styles.commentLabel]}>{t('reviews.comment')}</Text>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder={t('reviews.commentPlaceholder')}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={1000}
          textAlignVertical="top"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <CustomButton text={t('common.save')} onPress={onSave} loading={isSaving} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewFormScreen;

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
  content: { padding: spacing.lg },
  label: { fontSize: typography.size.sm, fontWeight: typography.weight.medium, color: colors.text, marginBottom: spacing.sm },
  commentLabel: { marginTop: spacing.xl },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    fontSize: typography.size.md,
    color: colors.text,
    marginBottom: spacing.md,
  },
  error: { color: colors.danger, fontSize: typography.size.sm, marginBottom: spacing.sm, textAlign: 'center' },
});
