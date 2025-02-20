import { React, useState } from 'react';
import { StyleSheet, ScrollView, View, Image, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../assets/img/logo/logo-white-2.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('65656585')
    const navigation = useNavigation();

    const onOTPGeneratePressed = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/otp/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                }),
            });
    
            const data = await response.json();

            if(data.success){
                navigation.navigate('OTPScreen', { phoneNumber: phoneNumber });
            } else {
                Alert.alert('Error', 'Unable to store token securely.');
            }

            
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={Logo} style={[styles.logo]} resizeMode="contain" />
            
            <ScrollView>
                <CustomInput
                    placeholder="Phone Number"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                />

                <CustomButton 
                    text="Get Code" 
                    onPress={onOTPGeneratePressed}
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