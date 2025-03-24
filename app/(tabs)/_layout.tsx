import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import useAuth from '@modules/auth/hooks/useAuth';
import { Platform } from 'react-native';

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
    <>
      <UserMenu onMenuPress={() => setSideMenuVisible(true)} />
      <SideMenu 
        visible={sideMenuVisible} 
        onClose={() => setSideMenuVisible(false)} 
      />
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