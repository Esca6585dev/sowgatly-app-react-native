import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../assets/img/logo/logo-white-2.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { apiRequest } from '../config/api'
import { colors, spacing, typography } from '../theme'

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation();

    const onOTPGeneratePressed = async () => {
        if (!phoneNumber.trim()) {
            setError('Telefon belgiňizi giriziň');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const data = await apiRequest('/otp/generate', {
                method: 'POST',
                auth: false,
                body: { phone_number: phoneNumber },
            });

            if (data.success) {
                navigation.navigate('OTPScreen', { phoneNumber });
            } else {
                setError(data.message || 'Bu belgi bilen hasap tapylmady');
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
                <Text style={styles.title}>Hoş geldiňiz</Text>
                <Text style={styles.subtitle}>Dowam etmek üçin telefon belgiňizi giriziň</Text>

                <CustomInput
                    placeholder="65656585"
                    label="Telefon belgisi"
                    value={phoneNumber}
                    setValue={(v) => { setPhoneNumber(v); setError(''); }}
                    keyboardType="phone-pad"
                    error={error}
                />

                <CustomButton
                    text="Kody al"
                    onPress={onOTPGeneratePressed}
                    loading={isLoading}
                />

                <CustomButton
                    text="Hasabyň ýok bolsa, döret"
                    type="TERTIARY"
                    onPress={() => navigation.navigate('RegisterScreen')}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen

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
