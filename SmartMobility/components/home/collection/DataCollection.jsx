import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

import { useBle } from '../../../context/BleContext';
import { useAudioLevel } from '../../../hooks/useAudioLevel';
import { insertSensorReading } from '../../../services/supabase';
import styles from './DataCollection.style';

const DataCollection = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState([]);
  
  const { sensorData, connectedDevice } = useBle();
  const { dbLevel, startMonitoring, stopMonitoring } = useAudioLevel();
  
  const locationRef = useRef(null);

  // Monitor location in real time
  useEffect(() => {
    let subscription;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de acesso à localização negada.');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          locationRef.current = newLocation;
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Start sound decibel level monitoring on mount
  useEffect(() => {
    startMonitoring();
    return () => {
      stopMonitoring();
    };
  }, []);

  // Handle incoming Bluetooth data packet
  useEffect(() => {
    if (sensorData) {
      const currentLoc = locationRef.current;
      if (!currentLoc) {
        console.log('GPS location not ready yet.');
        return;
      }

      const dataArray = sensorData.split('@');
      if (dataArray.length < 4) return; // Verify UART packet schema

      const temp = parseFloat(dataArray[0]) || 0;
      const hum = parseFloat(dataArray[1]) || 0;
      const co = parseFloat(dataArray[2]) || 0;
      const dist = parseFloat(dataArray[3]) || 0;

      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        longitude: currentLoc.coords.longitude.toFixed(6),
        latitude: currentLoc.coords.latitude.toFixed(6),
        temperature: temp,
        humidity: hum,
        co_ppm: co,
        overtaking_dist: dist,
        sound_db: dbLevel,
      };

      // Add to front of array and keep only last 50 readings locally for performance
      setData((prevData) => [newData, ...prevData].slice(0, 50));

      // Post reading to Supabase Database
      insertSensorReading({
        deviceId: connectedDevice?.id || 'B1K3L4B-Device',
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude,
        temperature: temp,
        humidity: hum,
        coPpm: co,
        soundDb: dbLevel,
        overtakingDist: dist,
      }).catch((err) => {
        console.log('Erro Supabase (Ignore se offline ou sem chaves de API):', err.message);
      });
    }
  }, [sensorData, dbLevel]);

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.statusTitle}>Coletando Dados de Sensores</Text>
        <Text style={styles.deviceStatus}>
          Dispositivo: <Text style={styles.activeText}>{connectedDevice?.name || 'B1K3L4B'}</Text>
        </Text>
        <Text style={styles.noiseStatus}>
          Nível de Som Atual: <Text style={styles.noiseText}>{dbLevel} dB</Text>
        </Text>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>

      <ScrollView horizontal>
        <ScrollView style={{ minWidth: 600 }}>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title style={styles.colTitle}>Hora</DataTable.Title>
              <DataTable.Title style={styles.colTitle}>Lat / Lng</DataTable.Title>
              <DataTable.Title style={styles.colTitle} numeric>Temp (°C)</DataTable.Title>
              <DataTable.Title style={styles.colTitle} numeric>Umid (%)</DataTable.Title>
              <DataTable.Title style={styles.colTitle} numeric>CO (ppm)</DataTable.Title>
              <DataTable.Title style={styles.colTitle} numeric>Ruído (dB)</DataTable.Title>
              <DataTable.Title style={styles.colTitle} numeric>Ultrap. (cm)</DataTable.Title>
            </DataTable.Header>

            {data.map((item, index) => (
              <DataTable.Row key={index} style={styles.tableRow}>
                <DataTable.Cell style={styles.cellText}>{item.timestamp}</DataTable.Cell>
                <DataTable.Cell style={styles.cellText}>{`${item.latitude}, ${item.longitude}`}</DataTable.Cell>
                <DataTable.Cell style={styles.cellText} numeric>{item.temperature}</DataTable.Cell>
                <DataTable.Cell style={styles.cellText} numeric>{item.humidity}</DataTable.Cell>
                <DataTable.Cell style={styles.cellText} numeric>{item.co_ppm}</DataTable.Cell>
                <DataTable.Cell style={styles.cellText} numeric>{item.sound_db}</DataTable.Cell>
                <DataTable.Cell style={styles.cellText} numeric>{item.overtaking_dist}</DataTable.Cell>
              </DataTable.Row>
            ))}

            {data.length === 0 && (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>Aguardando dados do sensor...</Text>
              </View>
            )}
          </DataTable>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default DataCollection;
