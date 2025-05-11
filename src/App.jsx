
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AuthFlow from './components/AuthFlow';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import LightingControl from './pages/LightingControl';
import History from './pages/History';

const App = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            setUserProfile(profileData);
            setUser(user);
          } else {
            // If no profile exists, create one
            const initialProfile = {
              email: user.email,
              name: user.displayName || '',
              profileComplete: false
            };
            setUserProfile(initialProfile);
            setUser(user);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser(user);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            !user ? (
              <AuthFlow onComplete={handleProfileUpdate} />
            ) : userProfile?.profileComplete ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/profile?setup=true" replace />
            )
          } 
        />
        
        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage
                user={user}
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                user={user}
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route
          path="/lighting-control"
          element={
            user ? (
              <LightingControl
                user={user}
                userProfile={userProfile}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route
          path="/history"
          element={
            user ? (
              <History
                user={user}
                userProfile={userProfile}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 