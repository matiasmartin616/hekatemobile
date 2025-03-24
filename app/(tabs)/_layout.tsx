import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import useAuth from '@modules/auth/hooks/useAuth';
import { Platform } from 'react-native';

import TabBarIcon from '@shared/components/navigation/TabBarIcon';
import UserMenu from '@shared/components/navigation/UserMenu';
import {Colors} from '@shared/constants/Colors';
import useColorScheme from '@shared/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  console.log('Tab layout iniciado');
  return (
    <>
      <UserMenu />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          headerStyle: {
            height: Platform.OS === 'ios' ? 120 : 120,
          },
        }}>

        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </>

  );
}