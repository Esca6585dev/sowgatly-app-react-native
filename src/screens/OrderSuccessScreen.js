import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import CustomButton from '../components/CustomButton';
import { colors, radius, spacing, typography } from '../theme';

const OrderSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};
  const { t } = useTranslation();

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={40} color={colors.textInverse} />
      </View>

      <Text style={styles.title}>{t('orderSuccess.title')}</Text>
      <Text style={styles.subtitle}>
        {order?.id ? t('orderSuccess.number', { id: order.id }) : t('orderSuccess.created')}
      </Text>

      {order?.total_amount ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('orderSuccess.totalPaid')}</Text>
          <Text style={styles.cardValue}>{Math.floor(order.total_amount)} TMT</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <CustomButton text={t('orders.title')} onPress={() => navigation.replace('Orders')} type="SECONDARY" />
        <CustomButton text={t('orderSuccess.home')} onPress={goHome} />
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  cardValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  actions: {
    width: '100%',
    marginTop: spacing.xxl,
  },
});
