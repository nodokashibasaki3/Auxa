document.addEventListener('DOMContentLoaded', function() {
  // Navigation between screens
  const screenNavBtns = document.querySelectorAll('.screen-nav-btn');
  const screens = document.querySelectorAll('.screen-content');
  
  screenNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetScreen = this.dataset.screen;
      
      // Update active button
      screenNavBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show target screen, hide others
      screens.forEach(screen => {
        screen.classList.add('hidden');
        if (screen.id === `${targetScreen}-screen`) {
          screen.classList.remove('hidden');
        }
      });
    });
  });
  
  // Continue button to move to home screen
  document.getElementById('continue-btn').addEventListener('click', function() {
    document.querySelector('[data-screen="home"]').click();
  });
  
  // Color selection in onboarding
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(o => o.classList.remove('ring-2', 'ring-indigo-500'));
      this.classList.add('ring-2', 'ring-indigo-500');
    });
  });
  
  // Mood selection
  const moodOptions = document.querySelectorAll('.mood-option');
  moodOptions.forEach(option => {
    option.addEventListener('click', function() {
      moodOptions.forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      
      // Automatically suggest a light mode based on mood
      const mood = this.dataset.mood;
      const notificationEl = document.createElement('div');
      
      notificationEl.classList.add('fixed', 'bottom-4', 'right-4', 'bg-white', 'shadow-lg', 'rounded-lg', 'p-4', 'notification');
      
      let recommendedMode = 'calm';
      if (mood === 'focused') recommendedMode = 'focus';
      if (mood === 'stressed') recommendedMode = 'calm';
      if (mood === 'neutral') recommendedMode = 'relax';
      
      notificationEl.innerHTML = `
        <p class="text-sm">Based on your mood, we recommend <b>${recommendedMode} mode</b>.</p>
        <button class="px-2 py-1 bg-indigo-600 text-white text-xs rounded mt-2 auto-apply" data-mode="${recommendedMode}">Apply</button>
      `;
      
      document.body.appendChild(notificationEl);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        notificationEl.classList.add('opacity-0');
        setTimeout(() => notificationEl.remove(), 300);
      }, 5000);
      
      // Handle auto-apply button
      document.querySelector('.auto-apply').addEventListener('click', function() {
        const mode = this.dataset.mode;
        document.querySelector(`[data-mode="${mode}"] .apply-btn`).click();
        notificationEl.remove();
      });
    });
  });
  
  // Light mode application
  const applyBtns = document.querySelectorAll('.apply-btn');
  const lightModes = document.querySelectorAll('.light-mode');
  const currentMode = document.getElementById('current-mode');
  
  applyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const mode = this.parentElement.dataset.mode;
      const modeEmoji = this.parentElement.querySelector('.rounded-full').innerHTML;
      const modeName = this.parentElement.querySelector('.text-sm.font-medium').textContent;
      const modeDescription = this.parentElement.querySelector('.text-xs.text-gray-500').textContent;
      
      // Update current mode in dashboard
      let bgColor = 'bg-amber-50';
      let iconBgColor = 'bg-amber-200';
      
      if (mode === 'focus') {
        bgColor = 'bg-blue-50';
        iconBgColor = 'bg-blue-200';
      } else if (mode === 'relax') {
        bgColor = 'bg-purple-50';
        iconBgColor = 'bg-purple-200';
      }
      
      currentMode.className = `p-3 ${bgColor} rounded-lg`;
      currentMode.innerHTML = `
        <div class="flex items-center mb-2">
          <div class="w-6 h-6 ${iconBgColor} rounded-full flex items-center justify-center mr-2">${modeEmoji}</div>
          <div class="text-sm font-medium">${modeName} Active</div>
        </div>
        <div class="flex justify-between text-xs text-gray-600">
          <span>Brightness: ${mode === 'focus' ? '60%' : mode === 'relax' ? '20%' : '30%'}</span>
          <span>Color: ${mode === 'focus' ? 'Neutral' : 'Warm'}</span>
        </div>
      `;
      
      // Highlight active mode
      lightModes.forEach(m => m.classList.remove('active'));
      this.parentElement.classList.add('active');
      
      // Show toast notification
      const toastEl = document.createElement('div');
      toastEl.classList.add('fixed', 'bottom-4', 'left-4', 'bg-green-100', 'text-green-800', 'shadow-lg', 'rounded-lg', 'p-3', 'toast');
      toastEl.innerHTML = `<p>${modeName} applied!</p>`;
      
      document.body.appendChild(toastEl);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toastEl.classList.add('opacity-0');
        setTimeout(() => toastEl.remove(), 300);
      }, 3000);
    });
  });
  
  // Smart home connect buttons
  const connectBtns = document.querySelectorAll('.connect-btn');
  const connectedStatus = document.getElementById('connected-status');
  const statusMessage = document.getElementById('status-message');
  
  connectBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const device = this.dataset.device;
      const deviceName = device === 'hue' ? 'Philips Hue' : 'Google Home';
      
      // Simulate connecting
      this.textContent = 'Connecting...';
      
      setTimeout(() => {
        this.textContent = 'Connected';
        this.classList.remove('bg-indigo-600');
        this.classList.add('bg-green-600');
        
        connectedStatus.classList.remove('hidden');
        statusMessage.textContent = `${deviceName} connected successfully!`;
      }, 1500);
    });
  });
});

// Heart rate simulation for demo purposes
let currentHR = 72;
let stressLevel = 'normal'; // normal, elevated, high
let autoMode = true;

// Initialize HR display
function updateHR() {
  const hrDisplay = document.getElementById('current-hr');
  const homeHRDisplay = document.getElementById('home-hr');
  const hrIndicator = document.getElementById('hr-indicator');
  const stressIndicator = document.getElementById('stress-indicator');
  const stressStatus = document.getElementById('stress-status');
  
  if (!hrDisplay) return; // Return if elements aren't loaded yet
  
  // Update the HR number
  hrDisplay.textContent = currentHR;
  if (homeHRDisplay) homeHRDisplay.textContent = currentHR;
  
  // Update the HR indicator width (scale between 60-120bpm)
  const percentage = Math.min(100, Math.max(0, ((currentHR - 60) / 60) * 100));
  hrIndicator.style.width = `${percentage}%`;
  
  // Update stress indicators
  if (currentHR < 75) {
    stressLevel = 'normal';
    stressIndicator.className = 'w-2 h-2 rounded-full bg-green-500 mr-1';
    stressStatus.textContent = 'Normal stress levels';
  } else if (currentHR < 90) {
    stressLevel = 'elevated';
    stressIndicator.className = 'w-2 h-2 rounded-full bg-yellow-500 mr-1';
    stressStatus.textContent = 'Slightly elevated stress';
  } else {
    stressLevel = 'high';
    stressIndicator.className = 'w-2 h-2 rounded-full bg-red-500 mr-1';
    stressStatus.textContent = 'High stress detected';
  }
  
  // If auto mode is on, adjust lights based on HR
  if (autoMode && stressLevel !== 'normal') {
    // Show notification that lights are being auto-adjusted
    if (!document.querySelector('.auto-notification')) {
      const notifEl = document.createElement('div');
      notifEl.classList.add('fixed', 'bottom-4', 'right-4', 'bg-white', 'shadow-lg', 'rounded-lg', 'p-4', 'auto-notification');
      
      let recommendedMode = stressLevel === 'high' ? 'calm' : 'relax';
      
      notifEl.innerHTML = `
        <p class="text-sm">SensoryPulse™ detected ${stressLevel} stress.</p>
        <p class="text-sm">Auto-switching to <b>${recommendedMode} mode</b>.</p>
      `;
      
      document.body.appendChild(notifEl);
      
      // Switch to the appropriate light mode
      setTimeout(() => {
        // Simulate clicking the appropriate light mode
        const modeBtn = document.querySelector(`[data-mode="${recommendedMode}"] .apply-btn`);
        if (modeBtn) modeBtn.click();
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notifEl.classList.add('opacity-0');
          setTimeout(() => notifEl.remove(), 300);
        }, 3000);
      }, 1500);
    }
  }
}

// Simulate heart rate changes
function simulateHRChanges() {
  setInterval(() => {
    // Random walk algorithm to make HR changes seem natural
    const change = Math.random() > 0.5 ? 1 : -1;
    currentHR += change;
    
    // Every 15 seconds, simulate a stress event
    if (Math.random() > 0.98) {
      // Simulate stress event
      const stressEvent = setInterval(() => {
        currentHR += 2;
        if (currentHR > 95) {
          clearInterval(stressEvent);
          // Recovery phase
          const recovery = setInterval(() => {
            currentHR -= 1;
            if (currentHR <= 75) {
              clearInterval(recovery);
            }
            updateHR();
          }, 1000);
        }
        updateHR();
      }, 500);
    }
    
    // Keep HR in realistic range
    if (currentHR < 60) currentHR = 60;
    if (currentHR > 120) currentHR = 120;
    
    updateHR();
    updateHRGraph();
  }, 1000);
}

// Update the HR graph with new data point
function updateHRGraph() {
  const hrChart = document.getElementById('hr-chart');
  if (!hrChart) return;
  
  const svg = hrChart.querySelector('svg');
  if (!svg) return;
  
  const path = svg.querySelector('path');
  if (!path) return;
  
  // Get current path data and shift it left
  let pathData = path.getAttribute('d');
  let points = pathData.split(' ');
  
  // Simple animation: shift the path data left
  for (let i = 1; i < points.length; i++) {
    if (points[i].includes(',')) {
      let coords = points[i].split(',');
      let x = parseFloat(coords[0]);
      x -= 4;
      if (x < 0) x = 0;
      points[i] = `${x},${coords[1]}`;
    }
  }
  
  // Add new point at the end
  const hrValue = 100 - ((currentHR - 60) / 60) * 100;
  points[points.length - 1] = `300,${hrValue}`;
  
  // Update path
  path.setAttribute('d', points.join(' '));
  
  // Update the current HR marker
  const circle = svg.querySelector('circle');
  if (circle) {
    circle.setAttribute('cy', hrValue);
  }
}

// Toggle auto mode
function setupAutoModeToggle() {
  const autoToggle = document.getElementById('auto-toggle');
  const autoModeToggle = document.getElementById('auto-mode-toggle');
  
  if (autoToggle) {
    autoToggle.addEventListener('change', function() {
      autoMode = this.checked;
      if (autoModeToggle) {
        autoModeToggle.textContent = `Auto Mode: ${autoMode ? 'ON' : 'OFF'}`;
      }
    });
  }
  
  if (autoModeToggle) {
    autoModeToggle.addEventListener('click', function() {
      autoMode = !autoMode;
      this.textContent = `Auto Mode: ${autoMode ? 'ON' : 'OFF'}`;
      if (autoToggle) {
        autoToggle.checked = autoMode;
      }
    });
  }
}

// Setup calibration button
function setupCalibrationButton() {
  const calibrateBtn = document.getElementById('calibrate-btn');
  if (!calibrateBtn) return;
  
  calibrateBtn.addEventListener('click', function() {
    this.textContent = 'Calibrating...';
    
    const toast = document.createElement('div');
    toast.classList.add('fixed', 'bottom-4', 'left-4', 'bg-indigo-100', 'text-indigo-800', 'shadow-lg', 'rounded-lg', 'p-3', 'toast');
    toast.innerHTML = '<p>Calibrating SensoryPulse™ sensor...</p>';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      this.textContent = 'Calibrate';
      
      toast.innerHTML = '<p>Calibration complete! Your personalized stress thresholds have been updated.</p>';
      setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 2000);
  });
}

// Initialize all heart rate functionality
document.addEventListener('DOMContentLoaded', function() {
  // Setup initial HR
  updateHR();
  
  // Start HR simulation
  simulateHRChanges();
  
  // Setup toggles and buttons
  setupAutoModeToggle();
  setupCalibrationButton();
  
  // Add this to the existing screen navigation to update HR when switching tabs
  const screenNavBtns = document.querySelectorAll('.screen-nav-btn');
  screenNavBtns.forEach(btn => {
    const originalClickHandler = btn.onclick;
    btn.addEventListener('click', function() {
      if (typeof originalClickHandler === 'function') {
        originalClickHandler.call(this);
      }
      // Update HR display in case we switched to a screen with HR elements
      setTimeout(updateHR, 100);
    });
  });
});