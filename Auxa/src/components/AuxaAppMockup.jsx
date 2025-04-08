import React, { useState } from 'react';

const AuxaAppMockup = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [heartRate, setHeartRate] = useState(75);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isHeartRateConnected, setIsHeartRateConnected] = useState(false);
  const [isSmartLightsConnected, setIsSmartLightsConnected] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, name: 'Philips Hue', type: 'light', icon: '💡', connected: false },
    { id: 2, name: 'SensoryPulse Monitor', type: 'sensor', icon: '❤️', connected: false }
  ]);
  const [newDevice, setNewDevice] = useState({ name: '', type: 'light' });

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
      
      <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">
        Edit Profile
      </button>
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

  const renderBluetoothSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Connected Devices</h2>
        <button 
          className="text-sm bg-indigo-600 text-white py-1 px-3 rounded-lg"
          onClick={() => setShowAddDeviceModal(true)}
        >
          Add Device
        </button>
      </div>
      
      <div className="space-y-4">
        {devices.map(device => (
          <div key={device.id} className="bg-gray-50 p-4 rounded-lg flex items-center">
            <div className="h-12 w-12 mr-4 flex items-center justify-center">
              <span className="text-xl">{device.icon}</span>
            </div>
            <div className="flex-grow">
              <div className="text-sm font-medium">{device.name}</div>
              <div className="text-xs text-gray-500">
                {device.connected ? 'Connected' : `Connect your ${device.type}`}
              </div>
            </div>
            <button 
              className={`text-xs py-1 px-3 rounded-lg ${
                device.connected 
                  ? 'bg-gray-200 text-gray-700' 
                  : 'bg-indigo-600 text-white'
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
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${isBluetoothConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">Bluetooth</span>
          </div>
          <button 
            className="text-sm text-indigo-600 font-medium"
            onClick={() => setIsBluetoothConnected(!isBluetoothConnected)}
          >
            {isBluetoothConnected ? 'Turn Off' : 'Turn On'}
          </button>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Device</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Enter device name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                >
                  <option value="light">Smart Light</option>
                  <option value="sensor">Sensor</option>
                  <option value="camera">Camera</option>
                  <option value="speaker">Speaker</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
                onClick={() => setShowAddDeviceModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                onClick={() => {
                  if (newDevice.name) {
                    const icon = {
                      light: '💡',
                      sensor: '📊',
                      camera: '📹',
                      speaker: '🔊',
                      other: '🔌'
                    }[newDevice.type];
                    
                    setDevices([
                      ...devices,
                      {
                        id: Date.now(),
                        name: newDevice.name,
                        type: newDevice.type,
                        icon: icon,
                        connected: false
                      }
                    ]);
                    setNewDevice({ name: '', type: 'light' });
                    setShowAddDeviceModal(false);
                  }
                }}
              >
                Add Device
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