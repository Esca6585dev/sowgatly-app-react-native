import { StyleSheet } from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserScreen from '../screens/UserScreen';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const StackNavigation = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
        >
            <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
            <Stack.Screen name="Profile" component={ProfileScreen}></Stack.Screen>
            <Stack.Screen name="User" component={UserScreen}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default StackNavigation

const styles = StyleSheet.create({})