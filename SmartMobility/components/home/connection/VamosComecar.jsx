import React from 'react';
import {
  Text,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useBle } from '../../../context/BleContext';
import styles from "./VamosComecar.style";

export default function Button(props) {
  const { title = 'Começar Coleta' } = props;
  const navigation = useNavigation();
  const { connectedDevice } = useBle();

  const handlePress = () => {
    if (!connectedDevice) {
      Alert.alert(
        "Dispositivo Não Conectado",
        "Por favor, conecte-se ao seu dispositivo B1K3L4B via Bluetooth antes de iniciar a coleta de dados.",
        [{ text: "OK" }]
      );
    } else {
      navigation.navigate('DataCollectionScreen');
    }
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}