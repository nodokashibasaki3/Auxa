import React, { useState } from 'react';
import AuthFlow from './components/AuthFlow';
import AuxaAppMockup from './components/AuxaAppMockup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleAuthComplete = (profileData) => {
    setUserProfile(profileData);
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <AuthFlow onComplete={handleAuthComplete} />
      ) : (
        <AuxaAppMockup userProfile={userProfile} />
      )}
    </div>
  );
}

export default App; 