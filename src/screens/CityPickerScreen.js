import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import { useRegion } from '../context/RegionContext';
import { localize } from '../utils/localize';
import { colors, spacing, typography } from '../theme';

const CityPickerScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { region, setRegion } = useRegion();
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest('/regions?types=province,city')
      .then((json) => setRegions(json.data || []))
      .catch(() => setRegions([]))
      .finally(() => setIsLoading(false));
  }, []);

  const name = (r) => localize(r, 'name', i18n.language);

  // Provinces as section headers (selectable themselves), their cities below.
  const sections = useMemo(() => {
    const provinces = regions.filter((r) => r.type === 'province');
    const cities = regions.filter((r) => r.type === 'city');
    return provinces.map((p) => ({
      province: p,
      data: cities.filter((c) => c.parent_id === p.id),
    }));
  }, [regions]);

  const choose = (next) => {
    setRegion(next ? { id: next.id, name: next.name } : null);
    navigation.goBack();
  };

  const Row = ({ item, bold }) => {
    const active = region?.id === item?.id || (!item && !region);
    return (
      <TouchableOpacity style={styles.row} onPress={() => choose(item)}>
        <Text style={[styles.rowText, bold && styles.rowTextBold]}>
          {item ? name(item) : t('city.all')}
        </Text>
        {active && <Ionicons name="checkmark" size={20} color={colors.accent} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('city.choose')}</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<Row item={null} bold />}
          renderSectionHeader={({ section }) => <Row item={section.province} bold />}
          renderItem={({ item }) => (
            <View style={styles.indent}><Row item={item} /></View>
          )}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
};

export default CityPickerScreen;

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: { fontSize: typography.size.md, color: colors.text },
  rowTextBold: { fontWeight: typography.weight.semibold },
  indent: { paddingLeft: spacing.lg },
});
