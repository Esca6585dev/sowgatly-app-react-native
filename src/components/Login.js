import { StyleSheet, ScrollView, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen'
import React from 'react'

const Login = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LoginScreen />
      </ScrollView>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});