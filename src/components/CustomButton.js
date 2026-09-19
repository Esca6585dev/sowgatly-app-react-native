import { StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { colors, radius, spacing, typography } from '../theme'

const CustomButton = ({ onPress, text, type = 'PRIMARY', bgColor, fgColor, disabled, loading }) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
            styles.container,
            styles[`container_${type}`],
            bgColor ? { backgroundColor: bgColor } : {},
            isDisabled && styles.container_DISABLED,
            pressed && !isDisabled && styles.container_PRESSED,
        ]}>
      {loading ? (
        <ActivityIndicator color={type === 'PRIMARY' ? colors.textInverse : colors.primary} />
      ) : (
        <Text
          style={[
              styles.text,
              styles[`text_${type}`],
              fgColor ? { color: fgColor } : {},
          ]}>{text}</Text>
      )}
    </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: spacing.md,
        marginVertical: spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
    },
    container_PRIMARY: {
        backgroundColor: colors.primary,
    },
    container_SECONDARY: {
        borderColor: colors.primary,
        borderWidth: 1.5,
        backgroundColor: colors.background,
    },
    container_TERTIARY: {},
    container_PRESSED: {
        opacity: 0.85,
    },
    container_DISABLED: {
        opacity: 0.5,
    },
    text: {
        fontWeight: typography.weight.semibold,
        fontSize: typography.size.md,
        color: colors.textInverse,
    },
    text_TERTIARY: {
        color: colors.textMuted,
        fontWeight: typography.weight.medium,
    },
    text_SECONDARY: {
        color: colors.primary,
    }
})
