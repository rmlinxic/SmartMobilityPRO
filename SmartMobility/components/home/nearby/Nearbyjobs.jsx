import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as Location from 'expo-location';
import { DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const App = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState([]);

  // Função para obter a localização atual do usuário
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  };

  // Função para lidar com os dados recebidos
  const handleDataReceived = async (dataString) => {
    const location = await getLocation();
    if (!location) {
      console.log('Location is not available yet');
      return;
    }

    const dataArray = dataString.split('@');
    const newData = {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
      data1: dataArray[0],
      data2: dataArray[1],
      data3: dataArray[2],
    };
    setData(prevData => [...prevData, newData]);
  };

  // Substitua esta função pelo seu código para receber dados via Bluetooth
  useEffect(() => {
    const interval = setInterval(() => {
      const mockData = '1@2@3'; // Dados simulados
      handleDataReceived(mockData);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Longitude</DataTable.Title>
          <DataTable.Title>Latitude</DataTable.Title>
          <DataTable.Title>Data1</DataTable.Title>
          <DataTable.Title>Data2</DataTable.Title>
          <DataTable.Title>Data3</DataTable.Title>
        </DataTable.Header>

        {data.map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{item.longitude}</DataTable.Cell>
            <DataTable.Cell>{item.latitude}</DataTable.Cell>
            <DataTable.Cell>{item.data1}</DataTable.Cell>
            <DataTable.Cell>{item.data2}</DataTable.Cell>
            <DataTable.Cell>{item.data3}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      </ScrollView>
    </View>
  );
};

export default App;
