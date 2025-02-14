import React from 'react';
import { StyleSheet, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from './Main';
import Account from './Account';
import Chat from './Chat';
import Cart from './Cart';
import Favorite from './Favorite';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './Header';
import ProductDetails from './ProductDetails';
import StackNavigation from './StackNavigation'

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Icon style={styles.tabIcon} name={iconName} size={size} color={color} />;
        },
        tabBarLabel: () => {
          return <Text style={styles.tabIconTitle}>{route.name}</Text>;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: 'white', height: 70 },
      })}
    >
      <Tab.Screen name="Main" component={Main} options={{header: () => <Header />}}/>
      <Tab.Screen name="Favorite" component={Favorite} options={{header: () => <Header />}}/>
      <Tab.Screen name="Chat" component={Chat} options={{header: () => <Header />}}/>
      <Tab.Screen name="Cart" component={Cart} options={{header: () => <Header />}}/>
      <Tab.Screen name="Account" component={Account} options={{header: () => <Header />}}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: 'center'
  },
  tabIconTitle: {
    color: '#000',
    paddingVertical: 2
  }
});