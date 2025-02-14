import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { React, useState } from 'react'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'

const onResendPressed = () => {
    console.warn('onResendPressed')
}

const onBackLoginPress = () => {
    console.warn('onBackLoginPress')
}

const onConfirmPressed = () => {
    console.warn('onConfirmPressed')
}

const ConfirmEmailScreen = () => {
    const [code, setCode] = useState('')

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Confirm your email</Text>

                <CustomInput
                    placeholder="Enter your confirmation code"
                    value={code}
                    setValue={setCode}
                />

                <CustomButton 
                    text="Confirm" 
                    onPress={onConfirmPressed}
                />

                <CustomButton
                    text="Resend code?" 
                    onPress={onResendPressed} 
                    type="SECONDARY"
                />
                
                <CustomButton 
                    text="Back to Login" 
                    onPress={onBackLoginPress}
                    bgColor="#fae9ea"
                    fgColor="#dd4d44"
                />
            </View>
        </ScrollView>
    )
}

export default ConfirmEmailScreen

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