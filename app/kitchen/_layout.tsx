import { Tabs } from 'expo-router';
import { C } from '../../constants/colors';
import { Text } from 'react-native';

export default function KitchenLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: C.success,
        tabBarInactiveTintColor: C.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Outfit_700Bold',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Live Orders',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🍳</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Completed',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>✅</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
