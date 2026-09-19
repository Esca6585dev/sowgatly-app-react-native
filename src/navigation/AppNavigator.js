import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { colors } from '../theme'

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
import WelcomeScreen from '../screens/WelcomeScreen'
import LoginScreen from '../screens/LoginScreen'
import OTPScreen from '../screens/OTPScreen'
import RegisterScreen from '../screens/RegisterScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

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
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.background, height: 60 },
      })}
    >
      <Tab.Screen name="Main" component={Main} options={{ header: () => <Header /> }} />
      <Tab.Screen name="Favorite" component={Favorite} options={{ header: () => <Header /> }} />
      <Tab.Screen name="Chat" component={Chat} options={{ header: () => <Header /> }} />
      <Tab.Screen name="Cart" component={Cart} options={{ header: () => <Header /> }} />
      <Tab.Screen name="Account" component={Account} options={{ headerShown: false }} />
    </Tab.Navigator>
  )
}

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="OTPScreen" component={OTPScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
  </Stack.Navigator>
)

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
    <Stack.Screen name="HomeScreen" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false, title: 'Önüm' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Bildirişler' }} />
  </Stack.Navigator>
)

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default AppNavigator

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  tabIcon: {
    textAlign: 'center'
  },
  tabIconTitle: {
    color: colors.text,
    paddingVertical: 2
  }
})
