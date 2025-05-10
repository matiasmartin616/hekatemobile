import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Text } from 'react-native';
import TabBarIcon from '@/app/modules/shared/components/navigation/tabbar-icon';
import TopMenu from '@/app/modules/shared/components/navigation/top-menu';
import SideMenu from '@/app/modules/shared/components/navigation/side-menu';
import { useAuth } from '@/app/modules/shared/context/auth-context';
import colors from '@/app/modules/shared/theme/theme';
export default function TabLayout() {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const { user } = useAuth();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#000000',
          headerShown: true,
          tabBarStyle: {
            height: 85,
            paddingTop: 8,
            backgroundColor: colors.light.palette.blue[100],
          },
          tabBarLabel: ({ focused }) => (
            <Text style={{
              color: '#000000',
              fontWeight: focused ? 'bold' : 'normal'
            }} />
          ),
          header: () => <TopMenu onMenuPress={() => setSideMenuVisible(true)} />
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

      <SideMenu
        visible={sideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
      />
    </>
  );
}