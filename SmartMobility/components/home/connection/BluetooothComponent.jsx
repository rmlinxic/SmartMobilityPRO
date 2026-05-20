import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useBle } from '../../../context/BleContext';
import { COLORS, SIZES, FONT } from '../../../constants';

export default function BluetooothComponent() {
  const {
    connectedDevice,
    isScanning,
    scannedDevices,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
    bleError,
  } = useBle();

  const handleDevicePress = (device) => {
    if (connectedDevice && connectedDevice.id === device.id) {
      disconnectDevice();
    } else {
      connectToDevice(device);
    }
  };

  const renderItem = ({ item }) => {
    const isConnected = connectedDevice && connectedDevice.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.deviceItem, isConnected && styles.connectedItem]}
        onPress={() => handleDevicePress(item)}
      >
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name || 'Dispositivo Sem Nome'}</Text>
          <Text style={styles.deviceAddress}>{item.id}</Text>
        </View>
        <Text style={[styles.statusText, isConnected && styles.connectedStatusText]}>
          {isConnected ? 'Conectado' : 'Conectar'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {bleError && <Text style={styles.errorText}>{bleError}</Text>}

      {connectedDevice ? (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedLabel}>Conectado a:</Text>
          <Text style={styles.connectedName}>{connectedDevice.name}</Text>
          <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
            <Text style={styles.disconnectButtonText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.scanHeader}>
            <Text style={styles.sectionTitle}>Dispositivos Disponíveis</Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={isScanning ? stopScan : startScan}
            >
              {isScanning ? (
                <View style={styles.scanButtonContent}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.scanButtonText}>Parar</Text>
                </View>
              ) : (
                <Text style={styles.scanButtonText}>Escanear</Text>
              )}
            </TouchableOpacity>
          </View>

          {isScanning && scannedDevices.length === 0 && (
            <Text style={styles.infoText}>Buscando por dispositivos B1K3L4B...</Text>
          )}

          {!isScanning && scannedDevices.length === 0 && (
            <Text style={styles.infoText}>Nenhum dispositivo encontrado. Inicie o escaneamento.</Text>
          )}

          <FlatList
            data={scannedDevices}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            style={{ maxHeight: 200 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.small,
    backgroundColor: '#fff',
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  scanButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontFamily: FONT.bold,
    fontSize: SIZES.small,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  connectedItem: {
    backgroundColor: '#e6f7ed',
    paddingHorizontal: SIZES.small,
    borderRadius: 8,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  deviceAddress: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: COLORS.gray,
  },
  statusText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.small,
    color: COLORS.secondary,
  },
  connectedStatusText: {
    color: '#2e7d32',
  },
  connectedContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  connectedLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  connectedName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: '#2e7d32',
    marginVertical: SIZES.small,
  },
  disconnectButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  disconnectButtonText: {
    color: '#fff',
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
  errorText: {
    color: '#d32f2f',
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    marginBottom: SIZES.small,
  },
  infoText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: SIZES.medium,
  },
  listContainer: {
    paddingBottom: SIZES.small,
  },
});
