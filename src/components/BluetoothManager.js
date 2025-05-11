import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

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
    }
    return true; // iOS handles permissions differently
  }

  async startScanning(onDeviceFound) {
    if (this.isScanning) return;
    
    const permissionGranted = await this.checkPermissions();
    if (!permissionGranted) {
      throw new Error('Bluetooth permissions not granted');
    }

    this.isScanning = true;
    
    this.manager.startDeviceScan(null, null, (error, device) => {
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
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
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
}

export default new BluetoothManager();