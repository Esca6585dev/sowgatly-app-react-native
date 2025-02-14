import { React, useState } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../assets/img/logo/logo-white-2.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'

const onLoginPressed = () => {
    console.warn('Login')
}

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

const LoginScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.container}>
            <Image source={Logo} style={[styles.logo]} resizeMode="contain" />

            <ScrollView>
                <CustomInput
                    placeholder="Username"
                    value={username}
                    setValue={setUsername}
                />

                <CustomInput 
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    secureTextEntry
                />

                <CustomButton 
                    text="Login" 
                    onPress={onLoginPressed}
                />

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
                    text="Don't have an account? Create one"
                    onPress={onRegisterPressed}
                    type="TERTIARY"
                />
            </ScrollView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
    }
})