import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import ClockScreen from './screens/ClockScreen';
import AlarmScreen from './screens/AlarmScreen';
import TimerScreen from './screens/TimerScreen';
import { ClockIcon, AlarmIcon, TimerIcon } from './components/TabIcons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#1C1C1E',
              borderTopColor: '#38383A',
              borderTopWidth: StyleSheet.hairlineWidth,
            },
            tabBarActiveTintColor: '#FF9500',
            tabBarInactiveTintColor: '#8E8E93',
          }}
        >
          <Tab.Screen
            name="Clock"
            component={ClockScreen}
            options={{
              tabBarLabel: '时钟',
              tabBarIcon: ({ color, size }) => <ClockIcon color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="Alarm"
            component={AlarmScreen}
            options={{
              tabBarLabel: '闹钟',
              tabBarIcon: ({ color, size }) => <AlarmIcon color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="Timer"
            component={TimerScreen}
            options={{
              tabBarLabel: '计时器',
              tabBarIcon: ({ color, size }) => <TimerIcon color={color} size={size} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
