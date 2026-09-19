import { StyleSheet, View, Image, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Logo from '../../assets/img/logo/logo-white-2.png'
import CustomButton from '../components/CustomButton'
import { colors, spacing, typography } from '../theme'

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Sowgatly</Text>
        <Text style={styles.subtitle}>Iň gowy sowgatlary saýlaň we öýüňize eltip beriň</Text>
      </View>

      <View style={styles.actions}>
        <CustomButton text="Başla" onPress={() => navigation.navigate('LoginScreen')} />
        <CustomButton
          text="Täze hasap dörediň"
          type="TERTIARY"
          onPress={() => navigation.navigate('RegisterScreen')}
        />
      </View>
    </SafeAreaView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '55%',
    maxWidth: 220,
    height: 120,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.textInverse,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textInverse,
    opacity: 0.8,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  actions: {
    paddingBottom: spacing.lg,
  },
})
