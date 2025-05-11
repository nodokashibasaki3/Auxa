import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const ProfileSettings = ({ userProfile, onProfileUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    diagnosisType: '',
    autismType: '',
    lightSensitivity: 1,
    uncomfortableLightTypes: [],
    overwhelmedByLight: '',
    lightReactions: [],
    stressAwareness: '',
    stressCopingMethods: [],
    comfortWithAdjustments: '',
    preferredLighting: '',
    safeLighting: [],
    dislikedLighting: '',
    notificationPreference: '',
    manualOverride: '',
    trackEffectiveness: '',
    primaryUsage: [],
    lightNeedsChange: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (name, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedProfile = {
        ...formData,
        profileComplete: true
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });

      if (onProfileUpdate) {
        await onProfileUpdate(updatedProfile);
      }

      setSuccess(true);
      // Wait for 1 second to show success message before navigating
      setTimeout(() => {
        onCancel();
      }, 1000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Edit Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis Type</label>
          <select
            name="diagnosisType"
            value={formData.diagnosisType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          >
            <option value="">Select an option</option>
            <option value="professional">Professionally Diagnosed</option>
            <option value="self">Self-Diagnosed</option>
            <option value="in_progress">Diagnosis in Progress</option>
            <option value="suspected">Suspected but Not Diagnosed</option>
            <option value="family">Diagnosed by Family Member</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autism Type</label>
          <select
            name="autismType"
            value={formData.autismType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          >
            <option value="">Select an option</option>
            <option value="autism">Autism Spectrum Disorder (ASD)</option>
            <option value="aspergers">Asperger's Syndrome</option>
            <option value="pdd-nos">PDD-NOS</option>
            <option value="high-functioning">High-Functioning Autism</option>
            <option value="low-functioning">Low-Functioning Autism</option>
            <option value="atypical">Atypical Autism</option>
            <option value="level1">ASD Level 1</option>
            <option value="level2">ASD Level 2</option>
            <option value="level3">ASD Level 3</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Light Sensitivity</label>
          <input
            type="range"
            name="lightSensitivity"
            min="1"
            max="5"
            value={formData.lightSensitivity}
            onChange={handleInputChange}
            className="w-full"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Not sensitive</span>
            <span>Extremely sensitive</span>
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings; 