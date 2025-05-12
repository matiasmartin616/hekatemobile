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
          tabBarActiveTintColor: '#4299E1',
          tabBarInactiveTintColor: '#4299E1',
          headerShown: true,
          tabBarStyle: {
            height: 120,
            paddingTop: 8,
            backgroundColor: colors.light.palette.blue[100],
          },
          tabBarLabel: ({ focused }) => (
            <Text 
              style={{
                color: '#000000',
                fontSize: 12,
                fontFamily: 'Inter',
                fontWeight: focused ? 'bold' : 'normal',
                marginBottom: 10
              }}
            />
          ),
          header: () => <TopMenu onMenuPress={() => setSideMenuVisible(true)} />
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                imageName={require('@/assets/images/House.png')}
                color="#4299E1"
                style={{ opacity: focused ? 1 : 0.7 }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{
                color: '#4299E1',
                fontSize: 10,
                fontFamily: 'Inter',
                fontWeight: focused ? 'bold' : 'normal',
                marginBottom: 10
              }}>
                Home
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="routine"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                imageName={require('@/assets/images/Barbell.png')}
                color="#4299E1"
                style={{ opacity: focused ? 1 : 0.7 }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{
                color: '#4299E1',
                fontSize: 10,
                fontFamily: 'Inter',
                fontWeight: focused ? 'bold' : 'normal',
                marginBottom: 10
              }}>
                Mis rutinas
              </Text>
            ),
          }}
        />
        {/* <Tabs.Screen
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
        /> */}
        <Tabs.Screen
          name="reading"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                imageName={require('@/assets/images/BookOpen.png')}
                color="#4299E1"
                style={{ opacity: focused ? 1 : 0.7 }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{
                color: '#4299E1',
                fontSize: 10,
                fontFamily: 'Inter',
                fontWeight: focused ? 'bold' : 'normal',
                marginBottom: 10
              }}>
                Lectura del día
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="improve"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                imageName={require('@/assets/images/Heartbeat.png')}
                color="#4299E1"
                style={{ opacity: focused ? 1 : 0.7 }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{
                color: '#4299E1',
                fontSize: 10,
                fontFamily: 'Inter',
                fontWeight: focused ? 'bold' : 'normal',
                marginBottom: 10
              }}>
                Quiero mejorar
              </Text>
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