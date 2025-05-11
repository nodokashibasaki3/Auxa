import { BleManager } from 'react-native-ble-plx';
<<<<<<< HEAD
import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
=======
import { Platform, PermissionsAndroid } from 'react-native';
>>>>>>> origin/main

class BluetoothManager {
  constructor() {
    this.manager = new BleManager();
    this.isScanning = false;
  }

  async checkPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return Object.values(granted).every(status => status === 'granted');
<<<<<<< HEAD
    } else if (Platform.OS === 'ios') {
      // iOS requires Bluetooth permission in Info.plist
      // The actual permission request is handled by the system
      return true;
    }
    return false;
=======
    }
    return true; // iOS handles permissions differently
>>>>>>> origin/main
  }

  async startScanning(onDeviceFound) {
    if (this.isScanning) return;
    
    const permissionGranted = await this.checkPermissions();
    if (!permissionGranted) {
      throw new Error('Bluetooth permissions not granted');
    }

    this.isScanning = true;
    
<<<<<<< HEAD
    // iOS requires a specific scanning configuration
    const scanOptions = Platform.OS === 'ios' ? {
      allowDuplicates: false,
      scanMode: 'lowLatency',
    } : null;
    
    this.manager.startDeviceScan(null, scanOptions, (error, device) => {
=======
    this.manager.startDeviceScan(null, null, (error, device) => {
>>>>>>> origin/main
      if (error) {
        console.error('Scan error:', error);
        this.isScanning = false;
        return;
      }

      if (device) {
        onDeviceFound(device);
      }
    });
  }

  stopScanning() {
    this.manager.stopDeviceScan();
    this.isScanning = false;
  }

  async connectToDevice(deviceId) {
    try {
<<<<<<< HEAD
      const device = await this.manager.connectToDevice(deviceId, {
        timeout: 10000, // 10 second timeout
        autoConnect: false, // Don't automatically reconnect
      });
      
      // iOS requires explicit service discovery
      if (Platform.OS === 'ios') {
        await device.discoverAllServicesAndCharacteristics();
      }
      
=======
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
>>>>>>> origin/main
      return device;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async disconnectDevice(deviceId) {
    try {
      await this.manager.cancelDeviceConnection(deviceId);
    } catch (error) {
      console.error('Disconnection error:', error);
      throw error;
    }
  }
<<<<<<< HEAD

  // Add method to check if Bluetooth is powered on
  async isBluetoothEnabled() {
    try {
      const state = await this.manager.state();
      return state === 'PoweredOn';
    } catch (error) {
      console.error('Error checking Bluetooth state:', error);
      return false;
    }
  }
=======
>>>>>>> origin/main
}

export default new BluetoothManager();