import { React, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { StyleSheet, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

// Import your components
import Header from '../components/Header'
import Main from '../components/Main'
import Favorite from '../components/Favorite'
import Chat from '../components/Chat'
import Cart from '../components/Cart'
import Account from '../components/Account'

// Import your screens
import NotificationsScreen from '../screens/NotificationsScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import LoginScreen from '../screens/LoginScreen'
import OTPScreen from '../screens/OTPScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Tab Navigator Component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Main') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline'
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline'
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline'
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline'
          }

          return <Ionicons style={styles.tabIcon} name={iconName} size={size} color={color} />
        },
        tabBarLabel: () => {
          return <Text style={styles.tabIconTitle}>{route.name}</Text>
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: 'white', height: 60 },
      })}
    >
      <Tab.Screen name="Main" component={Main} options={{header: () => <Header />}}/>
      <Tab.Screen name="Favorite" component={Favorite} options={{header: () => <Header />}}/>
      <Tab.Screen name="Chat" component={Chat} options={{header: () => <Header />}}/>
      <Tab.Screen name="Cart" component={Cart} options={{header: () => <Header />}}/>
      <Tab.Screen name="Account" component={Account} options={{header: () => '' }}/>

    </Tab.Navigator>
  )
}

const HomeStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State for auth

  useEffect(() => {
      const checkAuth = async () => {
          try {
              const token = localStorage.getItem('access_token');
              setIsAuthenticated(!!token);
          } catch (error) {
              console.error("Error checking auth:", error);
              setIsAuthenticated(false);
          }
      };
      checkAuth();
  }, []);

  if (isAuthenticated === null) {
      return <Text>Loading...</Text>; // Loading state
  }

  return (
      <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
          {isAuthenticated ? ( // Conditional screens
              <>
                  <Stack.Screen name="HomeScreen" component={TabNavigator} options={{ headerShown: false }} />
                  <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false, title: 'Product Detail' }} />
                  <Stack.Screen name="Notifications" component={NotificationsScreen} />
                  {/* ... other authenticated screens */}
              </>
          ) : (
              <>
                  <Stack.Screen name="LoginScreen" component={LoginScreen} />
                  <Stack.Screen name="OTPScreen" component={OTPScreen} />
                  {/* ... other unauthenticated screens */}
              </>
          )}
      </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={HomeStackNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: 'center'
  },
  tabIconTitle: {
    color: '#000',
    paddingVertical: 2
  }
})