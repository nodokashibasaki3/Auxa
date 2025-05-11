import React, { useState, useEffect } from 'react';
import { calculateLightingSettings, calculateNotificationSettings, calculateStressResponseSettings } from '../utils/lightingCalculations';

const LightingSettings = ({ userProfile }) => {
  const [settings, setSettings] = useState({
    lighting: {},
    notifications: {},
    stressResponse: {}
  });

  useEffect(() => {
    if (userProfile) {
      setSettings({
        lighting: calculateLightingSettings(userProfile),
        notifications: calculateNotificationSettings(userProfile),
        stressResponse: calculateStressResponseSettings(userProfile)
      });
    }
  }, [userProfile]);

  const renderLightingSettings = () => {
    const { lighting } = settings;
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lighting Settings</h3>
        
        {/* Default Settings */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium mb-2">Default Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Brightness Range</p>
              <p className="font-medium">{lighting.default?.brightness?.min} - {lighting.default?.brightness?.max} lux</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Color Temperature</p>
              <p className="font-medium">{lighting.default?.colorTemp?.min}K - {lighting.default?.colorTemp?.max}K</p>
            </div>
          </div>
        </div>

        {/* Calm Mode */}
        {lighting.calmMode && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-medium mb-2">Calm Mode</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Brightness</p>
                <p className="font-medium">{lighting.calmMode.brightness.min} lux</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color Temperature</p>
                <p className="font-medium">{lighting.calmMode.colorTemp.min}K</p>
              </div>
            </div>
          </div>
        )}

        {/* Task Mode */}
        {lighting.taskMode && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-medium mb-2">Task Mode</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Brightness Range</p>
                <p className="font-medium">{lighting.taskMode.brightness.min} - {lighting.taskMode.brightness.max} lux</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color Temperature</p>
                <p className="font-medium">{lighting.taskMode.colorTemp.min}K - {lighting.taskMode.colorTemp.max}K</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNotificationSettings = () => {
    const { notifications } = settings;
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notification Settings</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Notify on every adjustment</span>
              <span className={`px-2 py-1 rounded ${notifications.notifyOnAdjustment ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {notifications.notifyOnAdjustment ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notify on significant changes</span>
              <span className={`px-2 py-1 rounded ${notifications.notifyOnSignificantChange ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {notifications.notifyOnSignificantChange ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Check-in interval</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {notifications.checkInInterval} minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStressResponseSettings = () => {
    const { stressResponse } = settings;
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stress Response Settings</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Calm Mode</span>
              <span className={`px-2 py-1 rounded ${stressResponse.enableCalmMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {stressResponse.enableCalmMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gradual Dimming</span>
              <span className={`px-2 py-1 rounded ${stressResponse.gradualDimming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {stressResponse.gradualDimming ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Undo Timeout</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {stressResponse.undoTimeout} seconds
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {renderLightingSettings()}
      {renderNotificationSettings()}
      {renderStressResponseSettings()}
    </div>
  );
};

export default LightingSettings; 