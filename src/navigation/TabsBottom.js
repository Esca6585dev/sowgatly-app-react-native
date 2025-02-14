import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from './Header'
import Main from './Main'
import Favorite from './Favorite'
import Chat from './Chat'
import Cart from './Cart'
import Account from './Account'

const TabsBottom = () => {
  return (
    <View>
      <Tab.Screen name="Main" component={Main} options={{header: () => <Header />}}/>
      <Tab.Screen name="Favorite" component={Favorite} options={{header: () => <Header />}}/>
      <Tab.Screen name="Chat" component={Chat} options={{header: () => <Header />}}/>
      <Tab.Screen name="Cart" component={Cart} options={{header: () => <Header />}}/>
      <Tab.Screen name="Account" component={Account} options={{header: () => ''}}/>
    </View>
  )
}

export default TabsBottom

const styles = StyleSheet.create({})