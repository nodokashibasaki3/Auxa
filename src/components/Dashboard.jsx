import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Dashboard = ({ userProfile }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Log Out
          </button>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-3xl text-indigo-600">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{userProfile?.name || 'User Name'}</h2>
              <p className="text-sm text-gray-600">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Diagnosis</p>
              <p className="font-medium">{userProfile?.diagnosisType === 'professional' ? 'Professional' : 'Self-diagnosed'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Autism Type</p>
              <p className="font-medium">{userProfile?.autismType || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/health')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl">❤️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Health Tracking</h3>
                <p className="text-sm text-gray-600">Track your heart rate, steps, and mood</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Profile</h3>
                <p className="text-sm text-gray-600">View and edit your profile</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl">⚙️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="text-sm text-gray-600">Manage your preferences</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 