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

// Import your screens
import NotificationsScreen from '../screens/NotificationsScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import RegisterScreen from '../screens/RegisterScreen'
import LoginScreen from '../screens/LoginScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Tab Navigator Component
function TabNavigator() {
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
      <Tab.Screen name="Account" component={LoginScreen} options={{header: () => '' }}/>

    </Tab.Navigator>
  )
}

// Home Stack Navigator Component
function HomeStackNavigator() {
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
      <Stack.Screen 
        name="HomeScreen" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} 
        options={{ 
          title: 'Product Detail',
          headerShown: false,
        }}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />

    </Stack.Navigator>
  )
}

// Main App Navigator
export default function AppNavigator() {
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

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: 'center'
  },
  tabIconTitle: {
    color: '#000',
    paddingVertical: 2
  }
})