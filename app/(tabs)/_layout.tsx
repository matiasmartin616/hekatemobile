import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import useAuth from '@modules/auth/hooks/useAuth';
import { Platform, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import TabBarIcon from '@shared/components/navigation/TabBarIcon';
import UserMenu from '@shared/components/navigation/UserMenu';
import SideMenu from '@shared/components/navigation/SideMenu';
import {Colors} from '@shared/constants/Colors';
import useColorScheme from '@shared/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserMenu onMenuPress={() => setSideMenuVisible(true)} />
      <SideMenu 
        visible={sideMenuVisible} 
        onClose={() => setSideMenuVisible(false)} 
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#000000',
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: '#b9d4f7',
          },
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: '#000000',
              fontWeight: focused ? 'bold' : 'normal'
            }} />
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'home' : 'home-outline'} 
                color={color}
                style={{ fontWeight: focused ? 'bold' : 'normal' }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="routine"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'folder' : 'folder-outline'} 
                color={color}
                style={{ fontWeight: focused ? 'bold' : 'normal' }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dreams"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'moon' : 'moon-outline'} 
                color={color}
                style={{ fontWeight: focused ? 'bold' : 'normal' }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="improve"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'heart' : 'heart-outline'} 
                color={color}
                style={{ fontWeight: focused ? 'bold' : 'normal' }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reading"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                name={focused ? 'book' : 'book-outline'} 
                color={color}
                style={{ fontWeight: focused ? 'bold' : 'normal' }}
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}