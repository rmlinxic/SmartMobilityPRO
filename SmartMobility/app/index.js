import React from 'react';
import { SafeAreaView, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../constants';
import { Welcome, DeviceConnection, DataCollection, SmartRouting } from '../components';

const Stack = createStackNavigator();

function Home() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Navigator
        screenOptions={{
          headerTitle: 'SmartMobility 2.0',
          headerBackTitle: null,
          headerShadowVisible: false
        }}
      >
        <Stack.Screen
          name="WelcomeScreen"
          component={Welcome}
        />
        <Stack.Screen
          name="DeviceConnectionScreen"
          component={DeviceConnection}
          options={{
            headerLeft: () => (
              <Button
                onPress={() => navigation.navigate('WelcomeScreen')}
                title="<"
                color="#000"
              />
            ),
          }}
        />
        <Stack.Screen
          name="DataCollectionScreen"
          component={DataCollection}
          options={{
            headerLeft: () => (
              <Button
                onPress={() => navigation.navigate('WelcomeScreen')}
                title="<"
                color="#000"
              />
            ),
          }}
        />
        <Stack.Screen
          name="SmartRoutingScreen"
          component={SmartRouting}
          options={{
            headerLeft: () => (
              <Button
                onPress={() => navigation.navigate('WelcomeScreen')}
                title="<"
                color="#000"
              />
            ),
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default Home;
