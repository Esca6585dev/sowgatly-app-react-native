import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import CustomButton from '../components/CustomButton';
import { colors, radius, spacing, typography } from '../theme';

export const loadAddresses = async () => {
  const json = await apiRequest('/me/addresses');
  return json.data || [];
};

const AddressesScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setAddresses(await loadAddresses());
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('common.genericError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const confirmDelete = (address) => {
    Alert.alert(t('addresses.deleteTitle'), address.address, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await apiRequest(`/me/addresses/${address.id}`, { method: 'DELETE' });
            refresh();
          } catch (e) {
            Alert.alert(t('common.error'), e.message || t('common.genericError'));
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('account.addresses')}</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading && addresses.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="location-outline" size={56} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>{t('addresses.empty')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('AddressForm', { address: item })}
            >
              <Ionicons name="location" size={20} color={item.is_default ? colors.accent : colors.textMuted} />
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{item.title || t('addresses.untitled')}</Text>
                  {item.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>{t('addresses.default')}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardAddress}>{item.address}</Text>
              </View>
              <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.footer}>
        <CustomButton text={t('addresses.add')} onPress={() => navigation.navigate('AddressForm')} />
      </View>
    </SafeAreaView>
  );
};

export default AddressesScreen;

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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.lg, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardBody: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardTitle: { fontSize: typography.size.md, fontWeight: typography.weight.semibold, color: colors.text },
  cardAddress: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: spacing.xs },
  defaultBadge: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  defaultText: { fontSize: typography.size.xs, color: colors.accent, fontWeight: typography.weight.semibold },
  deleteButton: { padding: spacing.xs },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
});
