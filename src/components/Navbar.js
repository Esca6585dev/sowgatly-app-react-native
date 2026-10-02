import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRegion } from '../context/RegionContext';
import { localize } from '../utils/localize';
import { colors, spacing, typography } from '../theme'

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { region } = useRegion();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bgColorWhite, { paddingTop: insets.top }]}>
      <Text style={styles.city}>{t('City')}</Text>

      <View style={styles.container}>

        <TouchableOpacity style={styles.containerLeft} onPress={() => navigation.navigate('CityPicker')}>
          <Text style={styles.cityName}>
            {region ? localize(region, 'name', i18n.language) : t('city.all')}
          </Text>
          <Icon name="angle-down" style={styles.iconAngleDown} size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.containerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({
  bgColorWhite: {
    backgroundColor: colors.background
  },
  city: {
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    fontSize: typography.size.md,
  },
  cityName: {
    fontWeight: typography.weight.bold,
    fontSize: typography.size.lg,
    color: colors.text,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  containerLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconAngleDown: {
    paddingLeft: spacing.xs,
  },
  iconButton: {
    marginLeft: spacing.md,
  },
});
