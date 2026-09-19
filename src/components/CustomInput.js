import { StyleSheet, TextInput, View, Text } from 'react-native'
import React from 'react'
import { colors, radius, spacing, typography } from '../theme'

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, label, error, keyboardType, autoCapitalize = 'none', editable = true }) => {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, error && styles.containerError]}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          style={styles.input} />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: spacing.xs,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  container: {
    backgroundColor: colors.surface,
    width: '100%',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  containerError: {
    borderColor: colors.danger,
  },
  input: {
    width: '100%',
    height: 48,
    fontSize: typography.size.md,
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.size.xs,
    marginTop: spacing.xs,
  },
})
