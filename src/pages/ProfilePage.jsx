import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  bio: '',
  dateOfBirth: '',
  diagnosisType: 'professional',
  autismType: '',
  lightSensitivity: 3,
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
  lightNeedsChange: '',
  profilePicture: null
};

const lightTypes = [
  'Fluorescent', 'LED', 'Incandescent', 'Halogen', 'Natural Sunlight', 'Other'
];
const reactions = [
  'Headache', 'Eye Strain', 'Fatigue', 'Anxiety', 'Irritability', 'Other'
];
const copingMethods = [
  'Sunglasses', 'Hats', 'Breaks', 'Dim Lights', 'Blue Light Glasses', 'Other'
];
const safeLightingOptions = [
  'Warm White', 'Cool White', 'Natural Light', 'Dimmed', 'Colored', 'Other'
];
const usageLocations = [
  'Home', 'Work', 'School', 'Outdoors', 'Other'
];

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in edit mode from URL
    const isEditMode = new URLSearchParams(location.search).get('edit') === 'true';
    setIsEditing(isEditMode);
    // Optionally, load user data here and setFormData
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && Array.isArray(formData[name])) {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Update profile in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        profileComplete: true
      });

      // Update auth profile if name changed
      if (formData.name) {
        await updateProfile(user, {
          displayName: formData.name
        });
      }

      setIsEditing(false);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Dashboard
              </button>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture and Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  {formData.profilePicture ? (
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-indigo-600">👤</span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    formData.name || 'Your Name'
                  )}
                </h2>
                <div className="text-sm text-gray-600">Member since {new Date().getFullYear()}</div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {formData.email || 'your@email.com'}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-32 p-1 border rounded"
                    />
                  ) : (
                    formData.phone || 'Not provided'
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-48 p-1 border rounded"
                    />
                  ) : (
                    formData.address || 'Not provided'
                  )}
                </div>
              </div>
            </div>

            {/* Bio/Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Short Bio / Notes</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-lg"
                  rows={2}
                  placeholder="Tell us a little about yourself..."
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.bio || 'No bio provided.'}</p>
              )}
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.dateOfBirth || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis Type</label>
                {isEditing ? (
                  <select
                    name="diagnosisType"
                    value={formData.diagnosisType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="professional">Professional Diagnosis</option>
                    <option value="self">Self-diagnosed</option>
                    <option value="in_progress">Diagnosis in Progress</option>
                    <option value="suspected">Suspected but Not Diagnosed</option>
                    <option value="family">Diagnosed by Family Member</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">
                    {formData.diagnosisType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Autism Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="autismType"
                    value={formData.autismType}
                    onChange={handleInputChange}
                    placeholder="Enter autism type"
                    className="mt-1 block w-full p-2 border rounded-lg"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.autismType || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Light Sensitivity</label>
                {isEditing ? (
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
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${(formData.lightSensitivity || 3) * 20}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{formData.lightSensitivity || 3}/5</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Uncomfortable Light Types</label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lightTypes.map(type => (
                      <label key={type} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          name="uncomfortableLightTypes"
                          value={type}
                          checked={formData.uncomfortableLightTypes.includes(type)}
                          onChange={handleInputChange}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.uncomfortableLightTypes.length > 0 ? formData.uncomfortableLightTypes.join(', ') : 'None'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Do you feel overwhelmed by lighting?</label>
                {isEditing ? (
                  <select
                    name="overwhelmedByLight"
                    value={formData.overwhelmedByLight}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.overwhelmedByLight || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reactions to Lighting</label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {reactions.map(type => (
                      <label key={type} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          name="lightReactions"
                          value={type}
                          checked={formData.lightReactions.includes(type)}
                          onChange={handleInputChange}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.lightReactions.length > 0 ? formData.lightReactions.join(', ') : 'None'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stress Awareness</label>
                {isEditing ? (
                  <select
                    name="stressAwareness"
                    value={formData.stressAwareness}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.stressAwareness || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coping Methods</label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {copingMethods.map(type => (
                      <label key={type} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          name="stressCopingMethods"
                          value={type}
                          checked={formData.stressCopingMethods.includes(type)}
                          onChange={handleInputChange}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.stressCopingMethods.length > 0 ? formData.stressCopingMethods.join(', ') : 'None'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Comfort with Adjustments</label>
                {isEditing ? (
                  <select
                    name="comfortWithAdjustments"
                    value={formData.comfortWithAdjustments}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="neutral">Neutral</option>
                    <option value="uncomfortable">Uncomfortable</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.comfortWithAdjustments || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Lighting</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="preferredLighting"
                    value={formData.preferredLighting}
                    onChange={handleInputChange}
                    placeholder="e.g. Warm, Cool, Dimmed, etc."
                    className="mt-1 block w-full p-2 border rounded-lg"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.preferredLighting || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Safe Lighting Types</label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {safeLightingOptions.map(type => (
                      <label key={type} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          name="safeLighting"
                          value={type}
                          checked={formData.safeLighting.includes(type)}
                          onChange={handleInputChange}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.safeLighting.length > 0 ? formData.safeLighting.join(', ') : 'None'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Least Preferred Lighting</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="dislikedLighting"
                    value={formData.dislikedLighting}
                    onChange={handleInputChange}
                    placeholder="e.g. Fluorescent, Bright, etc."
                    className="mt-1 block w-full p-2 border rounded-lg"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.dislikedLighting || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notification Preference</label>
                {isEditing ? (
                  <select
                    name="notificationPreference"
                    value={formData.notificationPreference}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push Notification</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.notificationPreference || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manual Override</label>
                {isEditing ? (
                  <select
                    name="manualOverride"
                    value={formData.manualOverride}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.manualOverride || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Track Effectiveness</label>
                {isEditing ? (
                  <select
                    name="trackEffectiveness"
                    value={formData.trackEffectiveness}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.trackEffectiveness || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Usage Locations</label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {usageLocations.map(type => (
                      <label key={type} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          name="primaryUsage"
                          value={type}
                          checked={formData.primaryUsage.includes(type)}
                          onChange={handleInputChange}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.primaryUsage.length > 0 ? formData.primaryUsage.join(', ') : 'None'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Do your lighting needs change throughout the day?</label>
                {isEditing ? (
                  <select
                    name="lightNeedsChange"
                    value={formData.lightNeedsChange}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{formData.lightNeedsChange || 'Not specified'}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 