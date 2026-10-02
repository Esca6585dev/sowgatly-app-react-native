import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import Icon from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { apiRequest } from '../config/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRegion } from '../context/RegionContext';
import { localize } from '../utils/localize';
import { colors, spacing, typography } from '../theme'

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { region } = useRegion();
  const [unread, setUnread] = useState(0);

  // The header belongs to the focused tab, so this refreshes whenever the
  // user comes back to a tab (e.g. after reading notifications).
  useFocusEffect(
    useCallback(() => {
      apiRequest('/me/notifications')
        .then((json) => setUnread(json.meta?.unread || 0))
        .catch(() => {});
    }, [])
  );
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
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
              </View>
            )}
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: typography.weight.bold,
  },
  iconButton: {
    marginLeft: spacing.md,
  },
});
