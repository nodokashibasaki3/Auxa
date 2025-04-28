import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { deleteUser, updatePassword } from 'firebase/auth';

const ProfileSettings = ({ userProfile }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    nickname: userProfile?.nickname || '',
    email: userProfile?.email || '',
    dateOfBirth: userProfile?.dateOfBirth || '',
    diagnosisType: userProfile?.diagnosisType || '',
    autismType: userProfile?.autismType || '',
    lightSensitivity: userProfile?.lightSensitivity || 1,
    medications: userProfile?.medications || '',
    allergies: userProfile?.allergies || '',
    emergencyContact: userProfile?.emergencyContact || '',
    emergencyPhone: userProfile?.emergencyPhone || '',
    oldPassword: '',
    newPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        ...formData
      }, { merge: true });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updatePassword(user, formData.newPassword);
      setSuccess('Password updated successfully!');
      setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      await auth.signOut();
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Return to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Return to Home
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Account Management */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Account Management</h2>
              
              {/* Profile Photo */}
              <div className="mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
                  Upload Photo
                </button>
              </div>

              {/* Password Change */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-medium">Change Password</h3>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
                >
                  Change Password
                </button>
              </div>

              {/* Delete Account */}
              <div className="border-t pt-6">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                {/* Health Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis Type</label>
                  <select
                    name="diagnosisType"
                    value={formData.diagnosisType}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Diagnosis Type</option>
                    <option value="professional">Professional Diagnosis</option>
                    <option value="self">Self-Diagnosed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Autism Type</label>
                  <select
                    name="autismType"
                    value={formData.autismType}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Autism Type</option>
                    <option value="autism">Autism</option>
                    <option value="aspergers">Asperger's Syndrome</option>
                    <option value="pdd-nos">PDD-NOS</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Light Sensitivity Level</label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="lightSensitivity"
                      min="1"
                      max="5"
                      value={formData.lightSensitivity}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Not Sensitive</span>
                      <span>Very Sensitive</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-4">Medical Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="List your current medications and dosages"
                      className="mt-1 w-full px-3 py-2 border rounded-lg"
                    ></textarea>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Allergies</label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="List any allergies or sensitivities"
                      className="mt-1 w-full px-3 py-2 border rounded-lg"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings; 