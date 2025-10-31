import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
//import { useAuth } from '../screens/context/AuthContext';
import { AuthStackParamList, RootStackParamList } from './types';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
//import SplashScreen from '../screens/SplashScreen';
import MainTabNavigator from './MainTabNavigator';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen 
    name="Login" 
    component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const RootNavigator = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  //using PersistGate's loading state 
    console.log('ROOT NAVIGATOR RENDER: accessToken =', accessToken);
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {accessToken == null ? (
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;