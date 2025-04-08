import React, { useState } from 'react';

const AuxaAppMockup = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState('home'); // home, profile, devices, heartrate
  const [heartRate, setHeartRate] = useState(75); // Mock heart rate data
  const [isConnected, setIsConnected] = useState({
    lights: false,
    heartRate: false
  });

  // Mock function to simulate heart rate changes
  const simulateHeartRateChange = () => {
    const newRate = Math.floor(Math.random() * (85 - 65) + 65);
    setHeartRate(newRate);
  };

  // Start heart rate simulation when component mounts
  React.useEffect(() => {
    const interval = setInterval(simulateHeartRateChange, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleConnection = (device) => {
    setIsConnected(prev => ({
      ...prev,
      [device]: !prev[device]
    }));
  };

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <div className="flex flex-col items-center mb-6">
        <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-xl font-bold">{userProfile?.name || 'User Name'}</h2>
        <p className="text-sm text-gray-500">{userProfile?.email || 'user@example.com'}</p>
      </div>
      
      <div className="space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="text-sm">{userProfile?.dateOfBirth || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Diagnosis</p>
              <p className="text-sm">{userProfile?.diagnosisType === 'professional' ? 'Professional' : 'Self'} - {userProfile?.autismType || 'Not specified'}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Light Sensitivity</h3>
          <div className="flex items-center">
            <div className="flex-grow">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-indigo-600 rounded-full" 
                  style={{ width: `${(userProfile?.lightSensitivity || 3) * 20}%` }}
                ></div>
              </div>
            </div>
            <span className="ml-2 text-sm font-medium">{userProfile?.lightSensitivity || 3}/5</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {userProfile?.lightSensitivity > 3 ? 'High sensitivity to bright lights' : 'Moderate sensitivity to bright lights'}
          </p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Account Settings</h3>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
            Edit Profile
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
            Notification Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
            Privacy Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const renderHeartRateTracker = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h2 className="text-lg font-bold mb-4">Heart Rate Monitor</h2>
      
      <div className="flex flex-col items-center mb-6">
        <div className="relative h-40 w-40 mb-4">
          <div className="absolute inset-0 rounded-full border-8 border-indigo-100"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">{heartRate}</div>
              <div className="text-sm text-gray-500">BPM</div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-xs">
          <div className="h-2 bg-gray-200 rounded-full mb-1">
            <div 
              className={`h-2 rounded-full ${
                heartRate < 60 ? 'bg-blue-500' : 
                heartRate < 80 ? 'bg-green-500' : 
                heartRate < 100 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (heartRate - 40) / 1.2)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
            <span>120</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Current Status</h3>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${
              heartRate < 60 ? 'bg-blue-500' : 
              heartRate < 80 ? 'bg-green-500' : 
              heartRate < 100 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <p className="text-sm">
              {heartRate < 60 ? 'Relaxed' : 
               heartRate < 80 ? 'Normal' : 
               heartRate < 100 ? 'Slightly Elevated' : 'Stressed'}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {heartRate < 60 ? 'Your heart rate indicates you are in a relaxed state.' : 
             heartRate < 80 ? 'Your heart rate is within normal range.' : 
             heartRate < 100 ? 'Your heart rate is slightly elevated. Consider calming activities.' : 
             'Your heart rate indicates stress. Lighting will adjust to help you relax.'}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Light Adjustment</h3>
          <p className="text-xs text-gray-500">
            {heartRate < 60 ? 'Maintaining current lighting settings.' : 
             heartRate < 80 ? 'Lighting is optimized for your current state.' : 
             heartRate < 100 ? 'Slightly dimming lights and adjusting to warmer tones.' : 
             'Dimming lights and switching to calming blue tones to help reduce stress.'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderDevices = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h2 className="text-lg font-bold mb-4">Connected Devices</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
          <div className="h-12 w-12 mr-4 flex items-center justify-center">
            <span className="text-xl">💡</span>
          </div>
          <div className="flex-grow">
            <div className="text-sm font-medium">Philips Hue</div>
            <div className="text-xs text-gray-500">
              {isConnected.lights ? 'Connected' : 'Not connected'}
            </div>
          </div>
          <button 
            onClick={() => toggleConnection('lights')}
            className={`text-xs py-1 px-3 rounded-lg ${
              isConnected.lights 
                ? 'bg-green-100 text-green-800' 
                : 'bg-indigo-600 text-white'
            }`}
          >
            {isConnected.lights ? 'Connected' : 'Connect'}
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
          <div className="h-12 w-12 mr-4 flex items-center justify-center">
            <span className="text-xl">❤️</span>
          </div>
          <div className="flex-grow">
            <div className="text-sm font-medium">SensoryPulse Wearable</div>
            <div className="text-xs text-gray-500">
              {isConnected.heartRate ? 'Connected' : 'Not connected'}
            </div>
          </div>
          <button 
            onClick={() => toggleConnection('heartRate')}
            className={`text-xs py-1 px-3 rounded-lg ${
              isConnected.heartRate 
                ? 'bg-green-100 text-green-800' 
                : 'bg-indigo-600 text-white'
            }`}
          >
            {isConnected.heartRate ? 'Connected' : 'Connect'}
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Device Settings</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Auto-connect on startup</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sync data in background</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Your connected devices will automatically sync with Auxa to provide personalized lighting experiences based on your heart rate and mood.
        </p>
      </div>
    </div>
  );

  const renderHome = () => (
    <>
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
      
      {/* Heart Rate Summary */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-600 mb-2">Heart Rate</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 mr-2 flex items-center justify-center">
                <span className="text-red-600">❤️</span>
              </div>
              <div className="text-sm font-medium">{heartRate} BPM</div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              heartRate < 60 ? 'bg-blue-100 text-blue-800' : 
              heartRate < 80 ? 'bg-green-100 text-green-800' : 
              heartRate < 100 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {heartRate < 60 ? 'Relaxed' : 
               heartRate < 80 ? 'Normal' : 
               heartRate < 100 ? 'Elevated' : 'Stressed'}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {isConnected.heartRate 
              ? 'Your heart rate data is being used to adjust lighting in real-time.' 
              : 'Connect your SensoryPulse device to enable real-time lighting adjustments.'}
          </p>
        </div>
      </div>
    </>
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
        <div className="flex justify-between bg-white rounded-lg p-1 shadow-sm">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
              activeTab === 'home' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
              activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('heartrate')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
              activeTab === 'heartrate' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Heart Rate
          </button>
          <button 
            onClick={() => setActiveTab('devices')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
              activeTab === 'devices' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Devices
          </button>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'home' && (
          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Auxa Home</h2>
              <button className="text-gray-600">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm">⚙️</span>
                </div>
              </button>
            </div>
            
            {renderHome()}
          </div>
        )}
        
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'heartrate' && renderHeartRateTracker()}
        {activeTab === 'devices' && renderDevices()}
        
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
      </div>
    </div>
  );
};

export default AuxaAppMockup; 