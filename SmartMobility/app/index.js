import React from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { COLORS, icons, SIZES } from '../constants';
import { Nearbyjobs, Popularjobs, ScreenHeaderBtn, Welcome } from '../components';

const Stack = createStackNavigator();

function Home() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView 
    style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Navigator
        screenOptions={{
          headerTitle: 'SmartMobility 2.0',
          headerBackTitle: null,
          color:"#FAFAFC",
          headerShadowVisible: false
        }}
      >
        <Stack.Screen
          name="WelcomeScreen"
          component={Welcome}
        />
        <Stack.Screen
          name="PopularJobsScreen"
          component={Popularjobs}
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
          name="NearbyJobsScreen"
          component={Nearbyjobs}
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
