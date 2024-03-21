import React from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './BikeComponent.style';

export default function BikeComponent() {
  const navigation = useNavigation();

  return (
    <Pressable
    style={styles.button} 
      onPress={() => navigation.navigate('PopularJobsScreen')}
    >
      <Text style={styles.text}>Vamos Começar!</Text>
    </Pressable>
  );
}
