import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { getDoc, doc } from 'firebase/firestore';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthFlow from './components/AuthFlow';
import AuxaAppMockup from './components/AuxaAppMockup';
import ProfilePage from './pages/ProfilePage';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setUserProfile(profileSnap.data());
          setIsAuthenticated(true);
        } else {
          await auth.signOut(); // No profile? Block access
        }
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route 
          path="/" 
          element={
            !isAuthenticated ? (
              <AuthFlow onComplete={(profile) => {
                setUserProfile(profile);
                setIsAuthenticated(true);
              }} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <AuxaAppMockup userProfile={userProfile} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? (
              <ProfilePage />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/settings" 
          element={
            isAuthenticated ? (
              <ProfileSettings userProfile={userProfile} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
