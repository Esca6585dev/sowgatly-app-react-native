import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, setLanguage } from '../i18n';
import { colors, radius, spacing, typography } from '../theme';

// Segmented TM / RU / EN picker. `inverse` is for dark backgrounds.
const ChangeLanguage = ({ inverse = false }) => {
  const { i18n } = useTranslation();

  return (
    <View style={[styles.row, inverse && styles.rowInverse]}>
      {LANGUAGES.map(({ code, label }) => {
        const active = i18n.language === code;
        return (
          <TouchableOpacity
            key={code}
            style={[styles.chip, active && (inverse ? styles.chipActiveInverse : styles.chipActive)]}
            onPress={() => setLanguage(code)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                styles.text,
                inverse && styles.textInverse,
                active && (inverse ? styles.textActiveInverse : styles.textActive),
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ChangeLanguage;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  rowInverse: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipActiveInverse: {
    backgroundColor: colors.background,
  },
  text: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
  },
  textInverse: {
    color: colors.textInverse,
  },
  textActive: {
    color: colors.textInverse,
    fontWeight: typography.weight.semibold,
  },
  textActiveInverse: {
    color: colors.text,
    fontWeight: typography.weight.semibold,
  },
});
