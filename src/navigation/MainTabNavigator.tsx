import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatsStackParamList, MainTabParamList } from './types';
import ChatListScreen from '../screens/chats/ChatListScreen';
import ChatScreen from '../screens/chats/ChatScreen';
import MediaViewScreen from '../screens/chats/MediaViewScreen';
import StatusScreen from '../screens/status/StatusScreen';
import CallsScreen from '../screens/calls/CallsScreen';
import ProfileScreen from '../screens/auth/Profile/ProfileScreen';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';


const Tab = createMaterialTopTabNavigator<MainTabParamList>();
const ChatsStack = createNativeStackNavigator<ChatsStackParamList>();

// the navigation stack for the "Chats" tab
const ChatsStackNavigator = () => {
  return (
    <ChatsStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <ChatsStack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Stack' }} />
      <ChatsStack.Screen name="ChatScreen" component={ChatScreen} />
      <ChatsStack.Screen name="MediaView" component={MediaViewScreen} options={{ headerShown: false }} />
    </ChatsStack.Navigator>
  );
};

//  main component that renders the Tab Navigator
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets(); // For handling notches and status bars

  return (
  
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>IPH Chats</Text>
        </View>
     <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarActiveTintColor: '#ff8400',
        tabBarInactiveTintColor: '#80ccffff',
        tabBarIndicatorStyle: {
          backgroundColor: '#ff8400',
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#0062A3',
          height: 2 + insets.top,
        },
      }}
    >
     
      <Tab.Screen
        name="Chats"
        component={ChatsStackNavigator}
      />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    </View>
  
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0062A3',
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  }
});

export default MainTabNavigator;