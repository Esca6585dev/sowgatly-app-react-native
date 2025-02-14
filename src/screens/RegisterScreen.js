import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { React, useState } from 'react'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native';

const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPassword")
}

const onLoginWithFacebook = () => {
    console.warn('onLoginWithFacebook')
}

const onLoginWithGoogle = () => {
    console.warn('onLoginWithGoogle')
}

const onLoginWithApple = () => {
    console.warn('onLoginWithApple')
}

const onRegisterPressed = () => {
    navigation.navigate("Register")
}

const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed')
}

const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed')
}

const RegisterScreen = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Create an account</Text>

                <CustomInput
                    placeholder="Username"
                    value={username}
                    setValue={setUsername}
                />

                <CustomInput
                    placeholder="Email"
                    value={email}
                    setValue={setEmail}
                />

                <CustomInput 
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    secureTextEntry
                />

                <CustomInput 
                    placeholder="Repeat Password"
                    value={passwordRepeat}
                    setValue={setPasswordRepeat}
                    secureTextEntry
                />

                <CustomButton 
                    text="Register" 
                    onPress={onRegisterPressed}
                />

                <Text style={styles.text}>
                    By registering, you confirm that you accept our {''}
                    <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and {''}
                    <Text style={styles.link} onPress={onPrivacyPressed}>Privacy Policy</Text>
                </Text>

                <CustomButton 
                    text="Forgot password?" 
                    onPress={onForgotPasswordPressed} 
                    type="TERTIARY" 
                />
                
                <CustomButton 
                    text="Login with Facebook" 
                    onPress={onLoginWithFacebook}
                    bgColor="#e7eaf4"
                    fgColor="#4765a9"
                />
                <CustomButton 
                    text="Login with Google" 
                    onPress={onLoginWithGoogle}
                    bgColor="#fae9ea"
                    fgColor="#dd4d44"
                />
                <CustomButton 
                    text="Login with Apple" 
                    onPress={onLoginWithApple}
                    bgColor="#e3e3e3"
                    fgColor="#363636"
                />
                
                <CustomButton 
                    text="Don't have an account ? Create one"
                    onPress={onRegisterPressed}
                    type="TERTIARY"
                />
            </View>
        </ScrollView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051c60',
        margin: 10,
    }, 
    text: {
        color: 'gray',
        marginVertical: 10,
    },
    link: {
        color: '#fdb075'
    }
})