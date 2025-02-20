import { React, useState } from 'react';
import { StyleSheet, ScrollView, View, Image, Alert } from 'react-native'
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../assets/img/logo/logo-white-2.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'

const storeToken = async (token) => {
    if (Platform.OS === 'web') {
        localStorage.setItem('access_token', token);
        console.log('Token stored in browser.', token);
    } else {
        try {
            await Keychain.setGenericPassword({ service: 'my_app_token', password: token });
            console.log('Token stored securely on device.');
        } catch (error) {
            console.error('Error storing token on device:', error);
        }
    }
}

const OTPScreen = ({ route }) => {
    const {phoneNumber} = route.params
    const [otp, setOtp] = useState('0000')
    const navigation = useNavigation()

    const onLoginPressed = async () => {
        console.log('Login');
    
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp: otp,
                }),
            });
    
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                await storeToken(data.access_token); // Store token in the appropriate location
                
                navigation.navigate('HomeScreen');
                
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                Alert.alert('Login Failed', errorData.message || 'Invalid phone number or OTP.');
                return;
            }
    
    
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('Error', 'An error occurred. Please try again later.');
        }
    }

    return (
        <View style={styles.container}>
            <Image source={Logo} style={[styles.logo]} resizeMode="contain" />
            
            <ScrollView>
                <CustomInput
                    placeholder="OTP Number"
                    value={otp}
                    setValue={setOtp}
                />

                <CustomButton 
                    text="Login"
                    onPress={onLoginPressed}
                />
            </ScrollView>
        </View>
    )
}

export default OTPScreen

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