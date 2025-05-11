import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import AuthFlow from './components/AuthFlow';
import AuxaAppMockup from './components/AuxaAppMockup';
import HealthTracking from './components/HealthTracking';
import ProfilePage from './pages/ProfilePage';
import ProfileSettings from './components/ProfileSettings';
import Dashboard from './components/Dashboard';

/**
 * Main App Component
 * Handles routing and authentication state
 */
function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Effect to handle authentication state changes and profile loading
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            setUserProfile(profileData);
            
            // Only navigate if it's the initial load and we're on the root path
            if (initialLoad && location.pathname === '/') {
              if (!profileData.profileComplete) {
                navigate('/profile?setup=true', { replace: true });
              } else {
                navigate('/dashboard', { replace: true });
              }
            }
          } else {
            // New user - no profile exists
            setUserProfile(null);
            if (initialLoad && location.pathname === '/') {
              navigate('/profile?setup=true', { replace: true });
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
        if (initialLoad && location.pathname === '/') {
          navigate('/', { replace: true });
        }
      }
      setLoading(false);
      setInitialLoad(false);
    });

    return () => unsubscribe();
  }, [navigate, initialLoad, location.pathname]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<AuthFlow onComplete={setUserProfile} />} />
        <Route path="/dashboard" element={<AuxaAppMockup userProfile={userProfile} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/profile" element={<AuthFlow />} />
        <Route 
          path="/health" 
          element={user ? <HealthTracking /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </div>
  );
}

export default App;
