import React from 'react';
import { View, Text } from "react-native";
import styles from "./DeviceConnection.style";
import GoogleMapsAPI from '../welcome/GoogleMapsAPI';
import VamosComecar from './VamosComecar';
import BluetooothComponent from './BluetooothComponent';

const DeviceConnection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Vamos Nessa!</Text>
      </View>
      
      <View>
        <Text style={styles.headertitle}>Conexão de Sensores</Text>
        <BluetooothComponent />
      </View>

      <GoogleMapsAPI />

      <View style={{ marginTop: 10 }}>
        <VamosComecar />
      </View>
    </View>
  );
};

export default DeviceConnection;
