import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../assets/img/logo/logo-white-2.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { apiRequest } from '../config/api'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { colors, spacing, typography } from '../theme'

const RESEND_SECONDS = 60

const OTPScreen = ({ route }) => {
    const { phoneNumber } = route.params
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const { login } = useAuth()
    const { t } = useTranslation()
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
    const [isResending, setIsResending] = useState(false)
    const [info, setInfo] = useState('')

    useEffect(() => {
        if (secondsLeft <= 0) return undefined;
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft])

    const onResend = async () => {
        setIsResending(true);
        setError('');
        setInfo('');
        try {
            await apiRequest('/otp/generate', {
                method: 'POST',
                auth: false,
                body: { phone_number: phoneNumber },
            });
            setInfo(t('otp.resent'));
            setSecondsLeft(RESEND_SECONDS);
        } catch (e) {
            setError(e.message || t('common.genericError'));
        } finally {
            setIsResending(false);
        }
    }

    const onLoginPressed = async () => {
        if (otp.trim().length !== 4) {
            setError(t('otp.invalidLength'));
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
                setError(Array.isArray(data.message) ? data.message[0] : (data.message || t('otp.invalid')));
            }
        } catch (e) {
            setError(e.message || t('common.genericError'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>{t('otp.title')}</Text>
                <Text style={styles.subtitle}>{t('otp.subtitle', { phone: phoneNumber })}</Text>

                <CustomInput
                    placeholder="0000"
                    label={t('otp.label')}
                    value={otp}
                    setValue={(v) => { setOtp(v); setError(''); }}
                    keyboardType="number-pad"
                    error={error}
                />

                <CustomButton
                    text={t('otp.submit')}
                    onPress={onLoginPressed}
                    loading={isLoading}
                />

                {info ? <Text style={styles.info}>{info}</Text> : null}

                <TouchableOpacity
                    onPress={onResend}
                    disabled={secondsLeft > 0 || isResending}
                    style={styles.resend}
                >
                    <Text style={[styles.resendText, (secondsLeft > 0 || isResending) && styles.resendDisabled]}>
                        {secondsLeft > 0 ? t('otp.resendIn', { seconds: secondsLeft }) : t('otp.resend')}
                    </Text>
                </TouchableOpacity>

                <CustomButton
                    text={t('otp.changeNumber')}
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
    info: {
        color: colors.success,
        fontSize: typography.size.sm,
        marginTop: spacing.sm,
    },
    resend: {
        paddingVertical: spacing.md,
    },
    resendText: {
        color: colors.accent,
        fontWeight: typography.weight.semibold,
        fontSize: typography.size.sm,
    },
    resendDisabled: {
        color: colors.textMuted,
    },
    subtitle: {
        fontSize: typography.size.sm,
        color: colors.textMuted,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
})
