import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme';

const AddressFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const existing = route.params?.address;

  const [title, setTitle] = useState(existing?.title || '');
  const [address, setAddress] = useState(existing?.address || '');
  const [isDefault, setIsDefault] = useState(!!existing?.is_default);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    if (!address.trim()) {
      setError(t('addresses.addressRequired'));
      return;
    }

    setError('');
    setIsSaving(true);
    try {
      const body = { title: title.trim() || null, address: address.trim(), is_default: isDefault };
      if (existing) {
        await apiRequest(`/me/addresses/${existing.id}`, { method: 'PUT', body });
      } else {
        await apiRequest('/me/addresses', { method: 'POST', body });
      }
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
        <Text style={styles.title}>{existing ? t('addresses.edit') : t('addresses.add')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CustomInput
          label={t('addresses.titleLabel')}
          placeholder={t('addresses.titlePlaceholder')}
          value={title}
          setValue={setTitle}
          autoCapitalize="sentences"
        />
        <CustomInput
          label={t('addresses.addressLabel')}
          placeholder={t('addresses.addressPlaceholder')}
          value={address}
          setValue={(v) => { setAddress(v); setError(''); }}
          autoCapitalize="sentences"
          error={error}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{t('addresses.makeDefault')}</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ true: colors.accent, false: colors.border }}
          />
        </View>

        <CustomButton text={t('common.save')} onPress={onSave} loading={isSaving} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressFormScreen;

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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  switchLabel: { fontSize: typography.size.md, color: colors.text },
});
