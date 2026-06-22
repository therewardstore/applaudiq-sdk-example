import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import EmbedScreen from './screens/EmbedScreen';
import { StatusProvider } from './statusStore';

/** Real stack navigation: Home → Embed (push, with a back button + swipe-back). */
export type RootStackParamList = {
  Home: undefined;
  Embed: { mode: 'auto' | 'manual'; token?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            {/* Full-screen embed (no header) — native-stack keeps the iOS swipe-back + Android hardware back. */}
            <Stack.Screen name="Embed" component={EmbedScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </StatusProvider>
    </SafeAreaProvider>
  );
}
