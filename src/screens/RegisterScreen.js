import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { apiRequest } from '../config/api'
import { useAuth } from '../context/AuthContext'
import { colors, spacing, typography } from '../theme'

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const { login } = useAuth()

    const onRegisterPressed = async () => {
        if (!name.trim() || !phoneNumber.trim()) {
            setError('Ady we telefon belgiňizi giriziň');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const data = await apiRequest('/register', {
                method: 'POST',
                auth: false,
                body: {
                    name,
                    phone_number: phoneNumber,
                    email: email.trim() || undefined,
                },
            });

            if (data.success) {
                await login(data.access_token, data.user);
            } else {
                setError(data.message || 'Hasap döredip bolmady');
            }
        } catch (e) {
            setError(e.message || 'Näsazlyk ýüze çykdy. Gaýtadan synanyşyň.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Hasap dörediň</Text>
                <Text style={styles.subtitle}>Sowgatly-dan alyş-çalyş etmek üçin maglumatlaryňyzy giriziň</Text>

                <CustomInput
                    placeholder="Adyňyz"
                    label="Ady we familiýaňyz"
                    value={name}
                    setValue={(v) => { setName(v); setError(''); }}
                    autoCapitalize="words"
                />

                <CustomInput
                    placeholder="65656585"
                    label="Telefon belgisi"
                    value={phoneNumber}
                    setValue={(v) => { setPhoneNumber(v); setError(''); }}
                    keyboardType="phone-pad"
                />

                <CustomInput
                    placeholder="email@sowgatly.tm (islege görä)"
                    label="E-poçta"
                    value={email}
                    setValue={setEmail}
                    keyboardType="email-address"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <CustomButton
                    text="Hasaby dörediň"
                    onPress={onRegisterPressed}
                    loading={isLoading}
                />

                <CustomButton
                    text="Hasabyňyz bar bolsa, giriň"
                    type="TERTIARY"
                    onPress={() => navigation.navigate('LoginScreen')}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        padding: spacing.xl,
    },
    title: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.size.sm,
        color: colors.textMuted,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    errorText: {
        color: colors.danger,
        fontSize: typography.size.sm,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
})
