import React, { createContext, useState, useEffect, useContext } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BleContext = createContext();

const manager = new BleManager();

// UART Service UUIDs (Nordic UART Service is standard for BLE serial)
const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // TX on device = RX on app (Notifications)

// Pure JS Base64 to ASCII decoder
function base64ToAscii(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let decoded = '';
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '=') break;
    const value = chars.indexOf(char);
    if (value === -1) continue;
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      decoded += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return decoded;
}

export const BleProvider = ({ children }) => {
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [bleError, setBleError] = useState(null);

  // Request permissions for Android
  const requestPermissions = async () => {
    if (Platform.OS === 'ios') return true;

    if (Platform.OS === 'android' && Platform.Version < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização',
          message: 'Precisamos de localização para escanear dispositivos Bluetooth.',
          buttonNeutral: 'Perguntar Depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const scanGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Permissão de Scan Bluetooth',
          message: 'Precisamos escanear dispositivos Bluetooth.',
          buttonPositive: 'OK',
        }
      );
      const connectGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Permissão de Conexão Bluetooth',
          message: 'Precisamos conectar a dispositivos Bluetooth.',
          buttonPositive: 'OK',
        }
      );
      const locationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização',
          message: 'Precisamos de localização para o Bluetooth funcionar.',
          buttonPositive: 'OK',
        }
      );
      return (
        scanGranted === PermissionsAndroid.RESULTS.GRANTED &&
        connectGranted === PermissionsAndroid.RESULTS.GRANTED &&
        locationGranted === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return false;
  };

  // Wait for Bluetooth adapter to be powered on (required for iOS CBManager)
  const waitForBluetoothReady = () => {
    return new Promise((resolve, reject) => {
      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          subscription.remove();
          resolve(true);
        } else if (state === 'PoweredOff') {
          subscription.remove();
          reject(new Error('Bluetooth está desligado. Por favor, ative o Bluetooth nas Configurações.'));
        } else if (state === 'Unauthorized') {
          subscription.remove();
          reject(new Error('Acesso ao Bluetooth não autorizado. Verifique as permissões do app nas Configurações.'));
        } else if (state === 'Unsupported') {
          subscription.remove();
          reject(new Error('Este dispositivo não suporta Bluetooth Low Energy.'));
        }
        // 'Resetting' and 'Unknown' states: keep waiting
      }, true); // true = emit current state immediately

      // Timeout after 10s waiting for Bluetooth to be ready
      setTimeout(() => {
        subscription.remove();
        reject(new Error('Tempo esgotado aguardando o Bluetooth ficar pronto.'));
      }, 10000);
    });
  };

  const startScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setBleError('Permissões de Bluetooth negadas.');
      return;
    }

    // On iOS, we must ensure CBManager is in PoweredOn state before scanning
    try {
      await waitForBluetoothReady();
    } catch (err) {
      setBleError(err.message);
      return;
    }

    setScannedDevices([]);
    setIsScanning(true);
    setBleError(null);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setBleError(error.message);
        setIsScanning(false);
        manager.stopDeviceScan();
        return;
      }

      if (device && device.name) {
        setScannedDevices((prevDevices) => {
          const exists = prevDevices.some((d) => d.id === device.id);
          if (!exists) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Auto-stop scanning after 10 seconds
    setTimeout(() => {
      stopScan();
    }, 10000);
  };

  const stopScan = () => {
    manager.stopDeviceScan();
    setIsScanning(false);
  };

  const connectToDevice = async (device) => {
    try {
      stopScan();
      const connected = await manager.connectToDevice(device.id);
      setConnectedDevice(connected);
      
      const discovered = await connected.discoverAllServicesAndCharacteristics();
      
      // Monitor UART TX characteristic notifications
      discovered.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_TX_CHAR_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Erro na característica BLE:', error.message);
            return;
          }
          if (characteristic && characteristic.value) {
            const rawData = base64ToAscii(characteristic.value);
            setSensorData(rawData);
          }
        }
      );
    } catch (err) {
      setBleError(`Falha ao conectar: ${err.message}`);
      setConnectedDevice(null);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
      } catch (err) {
        console.error('Erro ao desconectar:', err);
      }
      setConnectedDevice(null);
      setSensorData(null);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  return (
    <BleContext.Provider
      value={{
        connectedDevice,
        isScanning,
        scannedDevices,
        sensorData,
        bleError,
        startScan,
        stopScan,
        connectToDevice,
        disconnectDevice,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

export const useBle = () => useContext(BleContext);
