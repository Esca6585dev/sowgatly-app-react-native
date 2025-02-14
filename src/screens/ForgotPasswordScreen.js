import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { React, useState } from 'react'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native';

const onSendPressed = () => {
    navigation.navigate("Home")
}

const onBackLoginPress = () => {
    navigation.navigate("Login")
}

const NewPasswordScreen = () => {
    const [username, setUsername] = useState('')

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Reset your password</Text>

                <CustomInput
                    placeholder="Username"
                    value={username}
                    setValue={setUsername}
                />

                <CustomButton 
                    text="Send" 
                    onPress={onSendPressed}
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

export default NewPasswordScreen

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