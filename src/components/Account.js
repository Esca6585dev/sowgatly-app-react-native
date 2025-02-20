import { StyleSheet, ScrollView, View } from 'react-native';
import React from 'react'
import LoginScreen from '../screens/LoginScreen'

const Account = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LoginScreen />
      </ScrollView>
    </View>
  )
}

export default Account

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff'
  },
})