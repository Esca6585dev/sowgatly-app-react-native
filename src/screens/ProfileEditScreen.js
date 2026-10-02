import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme';

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    if (!name.trim()) {
      setError(t('profile.nameRequired'));
      return;
    }

    setError('');
    setIsSaving(true);
    try {
      const data = await apiRequest('/users/me', {
        method: 'PUT',
        body: { name: name.trim(), email: email.trim() || null },
      });
      await updateUser({ ...user, ...data.user });
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
        <Text style={styles.title}>{t('profile.edit')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CustomInput
          label={t('register.nameLabel')}
          placeholder={t('register.namePlaceholder')}
          value={name}
          setValue={(v) => { setName(v); setError(''); }}
          autoCapitalize="words"
        />
        <CustomInput
          label={t('register.email')}
          placeholder={`email@sowgatly.tm (${t('common.optional')})`}
          value={email}
          setValue={(v) => { setEmail(v); setError(''); }}
          keyboardType="email-address"
        />
        <CustomInput
          label={t('common.phone')}
          value={user?.phone_number || ''}
          editable={false}
        />
        <Text style={styles.hint}>{t('profile.phoneHint')}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <CustomButton text={t('common.save')} onPress={onSave} loading={isSaving} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;

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
  hint: { fontSize: typography.size.xs, color: colors.textMuted, marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: typography.size.sm, marginBottom: spacing.sm, textAlign: 'center' },
});
