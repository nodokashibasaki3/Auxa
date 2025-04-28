import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AuxaAppMockup = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [heartRate, setHeartRate] = useState(75);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isHeartRateConnected, setIsHeartRateConnected] = useState(false);
  const [isSmartLightsConnected, setIsSmartLightsConnected] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [devices, setDevices] = useState(
    process.env.REACT_APP_IS_DEMO === 'true'
      ? [{ id: 1, name: 'Philips Hue', type: 'light', icon: '💡', connected: true }]
      : []
  );
  
  const [newDevice, setNewDevice] = useState({ name: '', type: 'light' });

  const navigate = useNavigate();

  // Simulate heart rate changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => {
        // Simulate small random fluctuations
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(60, Math.min(100, prev + change));
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-3xl text-indigo-600">👤</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">{userProfile?.name || 'User Name'}</h2>
          <p className="text-sm text-gray-600">Member since {new Date().getFullYear()}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Date of Birth</span>
          <span className="text-sm text-gray-600">{userProfile?.dateOfBirth || 'Not provided'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Diagnosis</span>
          <span className="text-sm text-gray-600">{userProfile?.diagnosisType === 'professional' ? 'Professional' : 'Self-diagnosed'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Autism Type</span>
          <span className="text-sm text-gray-600">{userProfile?.autismType || 'Not specified'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Light Sensitivity</span>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
              <div 
                className="h-2 bg-indigo-600 rounded-full" 
                style={{ width: `${(userProfile?.lightSensitivity || 3) * 20}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{userProfile?.lightSensitivity || 3}/5</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <button onClick={() => navigate('/settings')} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">
          Profile Settings
        </button>
        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );

  const renderHeartRateTracker = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Heart Rate Monitor</h2>
        <div className={`h-3 w-3 rounded-full ${isHeartRateConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          <div className="h-40 w-40 rounded-full bg-indigo-50 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
              <div className="text-4xl font-bold text-indigo-600">{heartRate}</div>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
            BPM
          </div>
        </div>
        
        <div className="mt-8 w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Calm</span>
            <span>Stressed</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-indigo-600 rounded-full" 
              style={{ width: `${((heartRate - 60) / 40) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {heartRate < 70 ? 'You appear calm' : 
             heartRate < 85 ? 'You appear slightly stressed' : 
             'You appear highly stressed'}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium"
          onClick={() => setIsHeartRateConnected(!isHeartRateConnected)}
        >
          {isHeartRateConnected ? 'Disconnect Sensor' : 'Connect Sensor'}
        </button>
      </div>
    </div>
  );

  const connectToBluetoothDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'] // You can add UUIDs here
      });
  
      const newConnectedDevice = {
        id: device.id || Date.now(),
        name: device.name || 'Unknown Device',
        type: 'other',
        icon: '🔌',
        connected: true
      };
  
      setDevices([...devices, newConnectedDevice]);
      setShowAddDeviceModal(false);
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      alert('Failed to connect to device.');
    }
  };  

  const renderBluetoothSection = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Bluetooth Devices</h2>
        <button 
          className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-4 rounded-full transition"
          onClick={() => setShowAddDeviceModal(true)}
        >
          + Add Device
        </button>
      </div>
  
      {/* Device List */}
      <div className="space-y-4">
        {devices.length === 0 ? (
          <div className="text-center text-gray-500 text-sm italic py-4">No devices connected.</div>
        ) : (
          devices.map(device => (
            <div key={device.id} className="bg-gray-50 p-4 rounded-xl flex items-center shadow-sm">
              <div className="h-10 w-10 flex items-center justify-center text-lg mr-4">
                <span>{device.icon}</span>
              </div>
              <div className="flex-grow">
                <div className="text-base font-medium text-gray-800">{device.name}</div>
                <div className="text-sm text-gray-500">
                  {device.connected ? 'Connected' : `Tap to connect your ${device.type}`}
                </div>
              </div>
              <button 
                className={`text-xs font-medium py-1.5 px-4 rounded-full transition ${
                  device.connected 
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                onClick={() => {
                  const updatedDevices = devices.map(d => 
                    d.id === device.id ? { ...d, connected: !d.connected } : d
                  );
                  setDevices(updatedDevices);
                }}
              >
                {device.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))
        )}
      </div>
  
      {/* Bluetooth Status */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isBluetoothConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">Bluetooth</span>
        </div>
        <button 
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
          onClick={() => setIsBluetoothConnected(!isBluetoothConnected)}
        >
          {isBluetoothConnected ? 'Turn Off' : 'Turn On'}
        </button>
      </div>
  
      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Scan & Add New Bluetooth Device</h3>
            <p className="text-sm text-gray-500 mb-6">Click below to scan for nearby devices using Bluetooth.</p>
  
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full"
                onClick={() => setShowAddDeviceModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition"
                onClick={connectToBluetoothDevice}
              >
                Scan Devices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 p-4 space-y-8">
      {/* App Mockup Container */}
      <div className="max-w-md w-full flex flex-col space-y-8">
        
        {/* Header with Logo */}
        <div className="flex justify-center mb-2">
          <div className="text-3xl font-bold text-indigo-600">Auxa</div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-between bg-white rounded-lg shadow-sm p-1">
          <button 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              activeTab === 'home' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              activeTab === 'profile' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              activeTab === 'heart' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('heart')}
          >
            Heart Rate
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              activeTab === 'devices' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('devices')}
          >
            Devices
          </button>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'home' && (
          <>
            {/* Onboarding Survey Screen */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
              <h2 className="text-lg font-bold mb-4">Welcome to Auxa</h2>
              <p className="text-sm text-gray-600 mb-4">Let's personalize your experience. Tell us about your light sensitivity.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">How sensitive are you to bright lights?</label>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Not sensitive</span>
                    <span className="text-xs text-gray-500">Very sensitive</span>
                  </div>
                  <input type="range" className="w-full" min="1" max="5" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Which light color helps you feel calm?</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-amber-200 mb-1"></div>
                      <span className="text-xs">Warm</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-200 mb-1"></div>
                      <span className="text-xs">Cool</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-purple-200 mb-1"></div>
                      <span className="text-xs">Purple</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">
                  Continue
                </button>
              </div>
            </div>
            
            {/* Home Screen */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Auxa Home</h2>
                <button className="text-gray-600">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm">⚙️</span>
                  </div>
                </button>
              </div>
              
              {/* Current Mood */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 mb-2">How are you feeling now?</h3>
                <div className="flex justify-between">
                  <button className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-1">
                      <span className="text-xl">😊</span>
                    </div>
                    <span className="text-xs">Calm</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                      <span className="text-xl">🧠</span>
                    </div>
                    <span className="text-xs">Focused</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-1">
                      <span className="text-xl">😐</span>
                    </div>
                    <span className="text-xs">Neutral</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-1">
                      <span className="text-xl">😖</span>
                    </div>
                    <span className="text-xs">Stressed</span>
                  </button>
                </div>
              </div>
              
              {/* Light Modes */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 mb-2">Light Modes</h3>
                <div className="space-y-3">
                  <button className="flex items-center w-full bg-amber-50 p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-amber-200 mr-3 flex items-center justify-center">
                      <span className="text-amber-600">☀️</span>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">Calm Mode</div>
                      <div className="text-xs text-gray-500">Low intensity, warm tones</div>
                    </div>
                    <div className="text-indigo-600">Apply</div>
                  </button>
                  
                  <button className="flex items-center w-full bg-blue-50 p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-blue-200 mr-3 flex items-center justify-center">
                      <span className="text-blue-600">💡</span>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">Focus Mode</div>
                      <div className="text-xs text-gray-500">Medium brightness, neutral tones</div>
                    </div>
                    <div className="text-indigo-600">Apply</div>
                  </button>
                  
                  <button className="flex items-center w-full bg-purple-50 p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-purple-200 mr-3 flex items-center justify-center">
                      <span className="text-purple-600">🌙</span>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">Relax Mode</div>
                      <div className="text-xs text-gray-500">Dim, warm tones</div>
                    </div>
                    <div className="text-indigo-600">Apply</div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Dashboard Screen */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
              <h2 className="text-lg font-bold mb-4">Dashboard</h2>
              
              {/* Current Light Settings */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 mb-2">Current Light Settings</h3>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-amber-200 mr-2 flex items-center justify-center">
                      <span className="text-amber-600">☀️</span>
                    </div>
                    <div className="text-sm font-medium">Calm Mode Active</div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <div>Brightness: 30%</div>
                    <div>Color: Warm</div>
                  </div>
                </div>
              </div>
              
              {/* Mood History */}
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Your Mood History (Last 7 Days)</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-32 flex items-end justify-between">
                    <div className="flex flex-col items-center">
                      <div className="h-12 bg-green-400 w-6 rounded-t-md"></div>
                      <div className="text-xs mt-1">Mon</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-20 bg-green-400 w-6 rounded-t-md"></div>
                      <div className="text-xs mt-1">Tue</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-16 bg-yellow-400 w-6 rounded-t-md"></div>
                      <div className="text-xs mt-1">Wed</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-8 bg-red-400 w-6 rounded-t-md"></div>
                      <div className="text-xs mt-1">Thu</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-24 bg-green-400 w-6 rounded-t-md"></div>
                      <div className="text-xs mt-1">Fri</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-28 bg-green-400 w-6 rounded-t-md"></div>
                      <div className="text-xs mt-1">Sat</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-20 bg-green-400 w-6 rounded-t-md"></div>
                      <div className="text-xs mt-1">Sun</div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <div>Stressed</div>
                    <div>Calm</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'heart' && renderHeartRateTracker()}
        {activeTab === 'devices' && renderBluetoothSection()}
      </div>
    </div>
  );
};

export default AuxaAppMockup; 