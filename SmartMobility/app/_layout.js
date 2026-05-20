import React from 'react';
import { Stack } from 'expo-router';
import { BleProvider } from '../context/BleContext';

const Layout = () => {
  return (
    <BleProvider>
      <Stack />
    </BleProvider>
  );
}

export default Layout;