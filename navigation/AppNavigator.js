import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from '../screens/Login';
import { loadUserFromStorage } from '../features/auth/authSlice';
import Register from '../screens/Register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import { getCart, getUser } from '../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Header from '../components/Header';
import Search from '../screens/Search';
import Seller from '../screens/Seller';
import ProductDetail from '../screens/ProductDetail';
import Cart from '../screens/Cart';
import Profile from '../screens/Profile';


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
export default function AppNavigator() {
    const dispatch = useDispatch()
    useEffect(() => {
      const fetchData = async () => {
        try {
          let cart = await AsyncStorage.getItem('cart');
          cart = cart ? JSON.parse(cart) : []
          if(cart && cart.length > 0){
            dispatch(getCart(cart))
          } 
          
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: error.message,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };
    fetchData()
    dispatch(loadUserFromStorage())
  }, [])

    const {user} = useSelector(
      (state) => state.auth
    );
  useEffect(() => {
    if(user){
      dispatch(getUser());
    }
  },[user])
  return (
    <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='HomeLayout'
                options={{
                    headerTitle: () => (
                        <Header/>
                    ),
                }}
            >
                {({ navigation }) => (
                    <Tab.Navigator
                        screenOptions={{ headerShown: false }}
                    >
                        <Tab.Screen
                        name="Home"
                        component={Home}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                            ),
                        }}
                        />
                        <Tab.Screen
                        name="Search"
                        component={Search}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name="search" size={size} color={color} />
                            ),
                        }}
                        />
                        <Tab.Screen
                        name="Cart"
                        component={Cart}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name="cart" size={size} color={color} />
                            ),
                        }}
                        />
                        <Tab.Screen
                        name="Profile"
                        component={Profile}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                            ),
                        }}
                        />
                    </Tab.Navigator>
                )}
            </Stack.Screen>
            <Stack.Group 
            >
              <Stack.Screen name='Seller' component={Seller} options={{title: ""}}/>
              <Stack.Screen name='ProductDetail' component={ProductDetail} options={{title: ""}}/>

            </Stack.Group>
            <Stack.Screen name='Login' component={Login}  options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={Register}  options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight + 10
    },
  });