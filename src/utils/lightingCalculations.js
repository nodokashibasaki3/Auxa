/**
 * Utility functions for calculating lighting settings based on user preferences
 */

// Default lighting settings based on sensitivity levels
const SENSITIVITY_SETTINGS = {
  high: {
    brightness: { min: 60, max: 100 },
    colorTemp: { min: 2700, max: 3000 },
    transitionSpeed: 'slow'
  },
  moderate: {
    brightness: { min: 100, max: 150 },
    colorTemp: { min: 2700, max: 3500 },
    transitionSpeed: 'medium'
  },
  low: {
    brightness: { min: 150, max: 300 },
    colorTemp: { min: 2700, max: 4000 },
    transitionSpeed: 'fast'
  }
};

// Time-based settings
const TIME_BASED_SETTINGS = {
  morning: {
    brightness: { min: 150, max: 300 },
    colorTemp: { min: 3500, max: 4000 }
  },
  afternoon: {
    brightness: { min: 100, max: 200 },
    colorTemp: { min: 3000, max: 3500 }
  },
  evening: {
    brightness: { min: 60, max: 100 },
    colorTemp: { min: 2700, max: 3000 }
  }
};

// Location-based settings
const LOCATION_SETTINGS = {
  home: {
    default: {
      brightness: { min: 100, max: 200 },
      colorTemp: { min: 2700, max: 3500 }
    },
    evening: {
      brightness: { min: 60, max: 100 },
      colorTemp: { min: 2700, max: 3000 }
    }
  },
  school: {
    default: {
      brightness: { min: 150, max: 300 },
      colorTemp: { min: 3000, max: 4000 }
    }
  },
  workplace: {
    default: {
      brightness: { min: 150, max: 300 },
      colorTemp: { min: 3000, max: 4000 }
    }
  },
  clinic: {
    default: {
      brightness: { min: 100, max: 150 },
      colorTemp: { min: 2700, max: 3000 }
    }
  }
};

/**
 * Calculate lighting settings based on user profile
 * @param {Object} userProfile - User's profile data
 * @returns {Object} Calculated lighting settings
 */
export const calculateLightingSettings = (userProfile) => {
  const settings = {
    default: {},
    calmMode: {},
    taskMode: {},
    timeBased: {},
    locationBased: {}
  };

  // Calculate sensitivity-based settings
  const sensitivityLevel = userProfile.lightSensitivity;
  if (sensitivityLevel >= 4) {
    settings.default = SENSITIVITY_SETTINGS.high;
  } else if (sensitivityLevel >= 2) {
    settings.default = SENSITIVITY_SETTINGS.moderate;
  } else {
    settings.default = SENSITIVITY_SETTINGS.low;
  }

  // Calculate calm mode settings
  if (userProfile.overwhelmedByLight === 'yes') {
    settings.calmMode = {
      brightness: { min: 60, max: 60 },
      colorTemp: { min: 2700, max: 2700 },
      transitionSpeed: 'very_slow'
    };
  }

  // Calculate task mode settings
  if (userProfile.primaryUsage.includes('Workplace') || userProfile.primaryUsage.includes('School')) {
    settings.taskMode = {
      brightness: { min: 150, max: 300 },
      colorTemp: { min: 3000, max: 4000 },
      transitionSpeed: 'medium'
    };
  }

  // Calculate time-based settings
  if (userProfile.lightNeedsChange === 'yes') {
    settings.timeBased = TIME_BASED_SETTINGS;
  }

  // Calculate location-based settings
  userProfile.primaryUsage.forEach(location => {
    if (LOCATION_SETTINGS[location.toLowerCase()]) {
      settings.locationBased[location.toLowerCase()] = LOCATION_SETTINGS[location.toLowerCase()];
    }
  });

  // Apply problematic lighting type adjustments
  if (userProfile.uncomfortableLightTypes.includes('Flickering lights')) {
    settings.default.flickerFree = true;
  }
  if (userProfile.uncomfortableLightTypes.includes('Bright white')) {
    settings.default.colorTemp.max = Math.min(settings.default.colorTemp.max, 3000);
  }

  // Apply physical/emotional response adjustments
  if (userProfile.lightReactions.includes('Headaches') || userProfile.lightReactions.includes('Nausea')) {
    settings.default.colorTemp.max = Math.min(settings.default.colorTemp.max, 2700);
    settings.default.brightness.max = Math.min(settings.default.brightness.max, 100);
  }
  if (userProfile.lightReactions.includes('Anxiety') || userProfile.lightReactions.includes('Trouble focusing')) {
    settings.default.colorTemp.min = Math.max(settings.default.colorTemp.min, 3000);
    settings.default.brightness.max = Math.min(settings.default.brightness.max, 150);
  }

  return settings;
};

/**
 * Calculate notification settings based on user preferences
 * @param {Object} userProfile - User's profile data
 * @returns {Object} Notification settings
 */
export const calculateNotificationSettings = (userProfile) => {
  return {
    notifyOnAdjustment: userProfile.notificationPreference === 'always',
    notifyOnSignificantChange: userProfile.notificationPreference === 'only_sometimes',
    checkInInterval: userProfile.stressAwareness === 'rarely' || userProfile.stressAwareness === 'never' ? 60 : 30,
    allowManualOverride: userProfile.manualOverride === 'yes',
    trackEffectiveness: userProfile.trackEffectiveness === 'yes'
  };
};

/**
 * Calculate stress response settings
 * @param {Object} userProfile - User's profile data
 * @returns {Object} Stress response settings
 */
export const calculateStressResponseSettings = (userProfile) => {
  return {
    enableCalmMode: userProfile.overwhelmedByLight === 'yes',
    gradualDimming: userProfile.stressCopingMethods.includes('Turn off lights') || 
                    userProfile.stressCopingMethods.includes('Leave the room'),
    undoTimeout: userProfile.comfortWithAdjustments === 'only_if_i_can_undo_it' ? 30 : 0,
    automaticAdjustments: userProfile.comfortWithAdjustments === 'yes'
  };
}; 