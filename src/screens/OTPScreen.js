import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../assets/img/logo/logo-white-2.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { apiRequest } from '../config/api'
import { useAuth } from '../context/AuthContext'
import { colors, spacing, typography } from '../theme'

const OTPScreen = ({ route }) => {
    const { phoneNumber } = route.params
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const { login } = useAuth()

    const onLoginPressed = async () => {
        if (otp.trim().length !== 4) {
            setError('4 sanly kody giriziň');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const data = await apiRequest('/login', {
                method: 'POST',
                auth: false,
                body: { phone_number: phoneNumber, otp },
            });

            if (data.success) {
                // Flips AuthContext.isAuthenticated, which switches AppNavigator
                // into the authenticated stack automatically.
                await login(data.access_token, data.user);
            } else {
                setError(Array.isArray(data.message) ? data.message[0] : (data.message || 'Kod nädogry'));
            }
        } catch (e) {
            setError(e.message || 'Näsazlyk ýüze çykdy. Gaýtadan synanyşyň.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Kody giriziň</Text>
                <Text style={styles.subtitle}>{phoneNumber} belgä iberilen kody giriziň</Text>

                <CustomInput
                    placeholder="0000"
                    label="Tassyklama kody"
                    value={otp}
                    setValue={(v) => { setOtp(v); setError(''); }}
                    keyboardType="number-pad"
                    error={error}
                />

                <CustomButton
                    text="Girmek"
                    onPress={onLoginPressed}
                    loading={isLoading}
                />

                <CustomButton
                    text="Belgini üýtget"
                    type="TERTIARY"
                    onPress={() => navigation.goBack()}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default OTPScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    logo: {
        width: '55%',
        maxWidth: 220,
        height: 110,
        marginBottom: spacing.lg,
        tintColor: colors.primary,
    },
    title: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.size.sm,
        color: colors.textMuted,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
})
