import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * AuthFlow Component
 * Handles user authentication and profile setup flow
 * @param {Object} props
 * @param {Function} props.onComplete - Callback function when profile setup is complete
 * @param {boolean} props.isEditing - Whether the component is in edit mode
 * @param {boolean} props.isSetup - Whether the component is in setup mode
 */
const AuthFlow = ({ onComplete, isEditing = false, isSetup = false }) => {
  // State management
  const [step, setStep] = useState('signin');
  const [profileStep, setProfileStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in setup mode from URL
  const isSetupMode = new URLSearchParams(location.search).get('setup') === 'true';

  useEffect(() => {
    // If we're in setup mode, start with profile setup
    if (isSetupMode || isSetup) {
      setStep('profile');
    }
  }, [isSetupMode, isSetup]);

  /**
   * Form data state containing all user information
   * @typedef {Object} FormData
   */
  const [formData, setFormData] = useState({
    // Basic Info
    email: '',
    password: '',
    name: '',
    dateOfBirth: '',
    diagnosisType: '',
    autismType: '',
    selfDiagnosed: false,
    // Light Sensitivity
    lightSensitivity: 1,
    uncomfortableLightTypes: [],
    overwhelmedByLight: '',
    lightReactions: [],
    // Stress Response
    stressAwareness: '',
    stressCopingMethods: [],
    comfortWithAdjustments: '',
    // Lighting Preferences
    preferredLighting: '',
    safeLighting: [],
    dislikedLighting: '',
    // Customization
    notificationPreference: '',
    manualOverride: '',
    trackEffectiveness: '',
    // Environment
    primaryUsage: [],
    lightNeedsChange: ''
  });

  /**
   * Handles input changes for form fields
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Profile setup steps configuration
   * @type {Array<{title: string, description: string, component: React.ReactNode}>}
   */
  const steps = [
    {
      title: "When were you born?",
      description: "This helps us personalize your experience",
      component: (
        <div className="w-full">
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      )
    },
    {
      title: "How were you diagnosed?",
      description: "This information helps us tailor our recommendations",
      component: (
        <div className="space-y-2 w-full">
          <select
            name="diagnosisType"
            value={formData.diagnosisType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
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
      )
    },
    {
      title: "What type of autism do you have?",
      description: "This helps us understand your specific needs",
      component: (
        <div className="w-full">
          <select
            name="autismType"
            value={formData.autismType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
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
      )
    },
    {
      title: "How sensitive are you to lighting changes?",
      description: "This helps us create the perfect lighting environment for you",
      component: (
        <div className="w-full">
          <input
            type="range"
            name="lightSensitivity"
            min="1"
            max="5"
            value={formData.lightSensitivity}
            onChange={handleInputChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Not sensitive</span>
            <span>Extremely sensitive</span>
          </div>
        </div>
      )
    },
    {
      title: "Which types of lighting are most uncomfortable for you?",
      description: "Select all that apply",
      component: (
        <div className="space-y-2 w-full">
          {['Bright white', 'Flickering lights', 'Fluorescent', 'Natural light', 'Color-changing lights', 'None'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                name="uncomfortableLightTypes"
                value={type}
                checked={formData.uncomfortableLightTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...formData.uncomfortableLightTypes, type]
                    : formData.uncomfortableLightTypes.filter(t => t !== type);
                  setFormData(prev => ({ ...prev, uncomfortableLightTypes: newTypes }));
                }}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Do you feel overwhelmed in places with harsh or bright lighting?",
      description: "This helps us understand your triggers",
      component: (
        <div className="space-y-2 w-full">
          <label className="flex items-center">
            <input
              type="radio"
              name="overwhelmedByLight"
              value="yes"
              checked={formData.overwhelmedByLight === 'yes'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="overwhelmedByLight"
              value="no"
              checked={formData.overwhelmedByLight === 'no'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm">No</span>
          </label>
        </div>
      )
    },
    {
      title: "What physical sensations or emotions do you notice when lighting bothers you?",
      description: "Select all that apply",
      component: (
        <div className="space-y-2 w-full">
          {['Headaches', 'Nausea', 'Anxiety', 'Trouble focusing', 'Eye strain', 'Dizziness', 'Irritability', 'Fatigue'].map((reaction) => (
            <label key={reaction} className="flex items-center">
              <input
                type="checkbox"
                name="lightReactions"
                value={reaction}
                checked={formData.lightReactions.includes(reaction)}
                onChange={(e) => {
                  const newReactions = e.target.checked
                    ? [...formData.lightReactions, reaction]
                    : formData.lightReactions.filter(r => r !== reaction);
                  setFormData(prev => ({ ...prev, lightReactions: newReactions }));
                }}
                className="mr-2"
              />
              <span className="text-sm">{reaction}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Are you able to notice when you're becoming overwhelmed or stressed?",
      description: "This helps us understand your self-awareness",
      component: (
        <div className="space-y-2 w-full">
          {['Always', 'Sometimes', 'Rarely', 'Never'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="stressAwareness"
                value={option.toLowerCase()}
                checked={formData.stressAwareness === option.toLowerCase()}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "What do you usually do when you start to feel stressed or overstimulated?",
      description: "Select all that apply",
      component: (
        <div className="space-y-2 w-full">
          {['Deep breaths', 'Leave the room', 'Turn off lights', 'Use headphones', 'Take a break', 'Find a quiet space', 'Other'].map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                name="stressCopingMethods"
                value={method}
                checked={formData.stressCopingMethods.includes(method)}
                onChange={(e) => {
                  const newMethods = e.target.checked
                    ? [...formData.stressCopingMethods, method]
                    : formData.stressCopingMethods.filter(m => m !== method);
                  setFormData(prev => ({ ...prev, stressCopingMethods: newMethods }));
                }}
                className="mr-2"
              />
              <span className="text-sm">{method}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Are you comfortable letting someone or something adjust your environment for you when you're stressed?",
      description: "This helps us understand your comfort level with automated adjustments",
      component: (
        <div className="space-y-2 w-full">
          {['Yes', 'No', 'Only if I can undo it'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="comfortWithAdjustments"
                value={option.toLowerCase().replace(' ', '_')}
                checked={formData.comfortWithAdjustments === option.toLowerCase().replace(' ', '_')}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "What type of lighting do you prefer when you are calm or relaxed?",
      description: "Select your preferred lighting",
      component: (
        <div className="space-y-2 w-full">
          {['Warm/dim', 'Soft blue', 'Natural daylight', 'Colored lights', 'Complete darkness', 'Other'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="preferredLighting"
                value={type.toLowerCase().replace('/', '_')}
                checked={formData.preferredLighting === type.toLowerCase().replace('/', '_')}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "What type of lighting makes you feel safe or in control?",
      description: "Select all that apply",
      component: (
        <div className="space-y-2 w-full">
          {['Dim lighting', 'Natural light', 'Warm colors', 'Cool colors', 'No light', 'Colored lights', 'Other'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                name="safeLighting"
                value={type}
                checked={formData.safeLighting.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...formData.safeLighting, type]
                    : formData.safeLighting.filter(t => t !== type);
                  setFormData(prev => ({ ...prev, safeLighting: newTypes }));
                }}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "What type of lighting do you dislike the most?",
      description: "Select your least preferred lighting",
      component: (
        <div className="space-y-2 w-full">
          {['Bright white', 'Fluorescent', 'Flickering', 'Harsh colors', 'Natural light', 'Other'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="dislikedLighting"
                value={type.toLowerCase().replace(' ', '_')}
                checked={formData.dislikedLighting === type.toLowerCase().replace(' ', '_')}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Would you like to be notified when AUXA adjusts the lighting?",
      description: "Choose your notification preference",
      component: (
        <div className="space-y-2 w-full">
          {['Always', 'Only sometimes', 'Never'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="notificationPreference"
                value={option.toLowerCase().replace(' ', '_')}
                checked={formData.notificationPreference === option.toLowerCase().replace(' ', '_')}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Would you like to have manual override options available?",
      description: "Choose your control preference",
      component: (
        <div className="space-y-2 w-full">
          {['Yes', 'No', 'Only during certain times'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="manualOverride"
                value={option.toLowerCase().replace(' ', '_')}
                checked={formData.manualOverride === option.toLowerCase().replace(' ', '_')}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Would you like AUXA to track how effective each lighting adjustment is?",
      description: "This helps us improve our recommendations",
      component: (
        <div className="space-y-2 w-full">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="trackEffectiveness"
                value={option.toLowerCase()}
                checked={formData.trackEffectiveness === option.toLowerCase()}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Where do you plan to use AUXA most often?",
      description: "Select all that apply",
      component: (
        <div className="space-y-2 w-full">
          {['Home', 'School', 'Clinic', 'Workplace', 'All of the above'].map((location) => (
            <label key={location} className="flex items-center">
              <input
                type="checkbox"
                name="primaryUsage"
                value={location}
                checked={formData.primaryUsage.includes(location)}
                onChange={(e) => {
                  const newLocations = e.target.checked
                    ? [...formData.primaryUsage, location]
                    : formData.primaryUsage.filter(l => l !== location);
                  setFormData(prev => ({ ...prev, primaryUsage: newLocations }));
                }}
                className="mr-2"
              />
              <span className="text-sm">{location}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Do your lighting needs change throughout the day?",
      description: "This helps us understand your daily patterns",
      component: (
        <div className="space-y-2 w-full">
          {['Yes', 'No', 'Not sure'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="lightNeedsChange"
                value={option.toLowerCase().replace(' ', '_')}
                checked={formData.lightNeedsChange === option.toLowerCase().replace(' ', '_')}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )
    }
  ];

  /**
   * Handles user sign in
   * @param {Event} e - The form submit event
   */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Check if user has a profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!userData.profileComplete) {
          // If profile is incomplete, go to profile setup
          setStep('profile');
        } else {
          // If profile is complete, call onComplete and navigate
          if (onComplete) {
            await onComplete(userData);
          }
          navigate('/dashboard');
        }
      } else {
        // If no profile exists, go to profile setup
        setStep('profile');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user sign up and initiates profile setup
   * @param {Event} e - The form submit event
   */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create initial user document
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        profileComplete: false
      });

      // Move to profile setup
      setStep('profile');
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileEdit = () => {
    setIsProfileEditing(true);
    setStep('profile');
    setProfileStep(0);
    // Load existing profile data
    loadProfileData();
  };

  const handleProfileComplete = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      console.log('Starting profile completion...');

      const updatedProfile = {
        ...formData,
        profileComplete: true
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      console.log('Profile marked as complete in Firestore');

      if (onComplete) {
        await onComplete(updatedProfile);
      }

      if (isProfileEditing) {
        // Stay on the profile editing page
        setIsProfileEditing(false);  // Reset editing state
        setStep('profile');          // Stay in profile state
        setProfileStep(0);           // Reset to first step
        // Show success message
        setError('Profile updated successfully!');
        setTimeout(() => setError(''), 3000); // Clear success message after 3 seconds
      } else {
        // Navigate to the dashboard after completing setup
        navigate('/dashboard', { replace: true });
      }

      return true;
    } catch (error) {
      console.error('Error in handleProfileComplete:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load profile data when in edit mode or setup mode
  useEffect(() => {
    if (isEditing || isSetup) {
      setStep('profile');
      loadProfileData();
    }
  }, [isEditing, isSetup]);

  const loadProfileData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFormData(prev => ({
          ...prev,
          email: data.email || '',
          name: data.name || '',
          dateOfBirth: data.dateOfBirth || '',
          diagnosisType: data.diagnosisType || '',
          autismType: data.autismType || '',
          selfDiagnosed: data.selfDiagnosed || false,
          lightSensitivity: data.lightSensitivity || 1,
          uncomfortableLightTypes: data.uncomfortableLightTypes || [],
          overwhelmedByLight: data.overwhelmedByLight || '',
          lightReactions: data.lightReactions || [],
          stressAwareness: data.stressAwareness || '',
          stressCopingMethods: data.stressCopingMethods || [],
          comfortWithAdjustments: data.comfortWithAdjustments || '',
          preferredLighting: data.preferredLighting || '',
          safeLighting: data.safeLighting || [],
          dislikedLighting: data.dislikedLighting || '',
          notificationPreference: data.notificationPreference || '',
          manualOverride: data.manualOverride || '',
          trackEffectiveness: data.trackEffectiveness || '',
          primaryUsage: data.primaryUsage || [],
          lightNeedsChange: data.lightNeedsChange || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError(error.message);
    }
  };

  const handleEditProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      console.log('Starting profile update...');

      // Update the user's profile with all collected information
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        profileComplete: true // Mark profile as complete
      }, { merge: true });

      console.log('Profile updated in Firestore');

      // Call onComplete to update the parent component's state
      onComplete({
        ...formData,
        profileComplete: true
      });

      console.log('Parent state updated with complete profile');

      // Navigate to dashboard immediately
      navigate('/dashboard');
      console.log('Navigated to dashboard');

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
      throw error; // Re-throw to be caught by handleSubmit
    }
  };

  /**
   * Handles form submission for all steps
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called with step:', step, 'profileStep:', profileStep);
  
    if (step === 'signin') {
      await handleSignIn(e);
    } else if (step === 'signup') {
      await handleSignUp(e);
    } else if (step === 'profile') {
      console.log('Handling profile step submission');
      
      // Validation for each profile step
      if (profileStep === 0 && !formData.dateOfBirth) {
        setError('Please enter your date of birth.');
        return;
      }
      if (profileStep === 1 && !formData.diagnosisType) {
        setError('Please select a diagnosis type.');
        return;
      }
      if (profileStep === 2 && !formData.autismType) {
        setError('Please select an autism type.');
        return;
      }
      if (profileStep === 3 && !formData.lightSensitivity) {
        setError('Please indicate your light sensitivity level.');
        return;
      }
      if (profileStep === 4 && formData.uncomfortableLightTypes.length === 0) {
        setError('Please select at least one uncomfortable light type.');
        return;
      }
      if (profileStep === 5 && !formData.overwhelmedByLight) {
        setError('Please indicate if you feel overwhelmed by lighting.');
        return;
      }
      if (profileStep === 6 && formData.lightReactions.length === 0) {
        setError('Please select at least one reaction to lighting.');
        return;
      }
      if (profileStep === 7 && !formData.stressAwareness) {
        setError('Please indicate your stress awareness level.');
        return;
      }
      if (profileStep === 8 && formData.stressCopingMethods.length === 0) {
        setError('Please select at least one coping method.');
        return;
      }
      if (profileStep === 9 && !formData.comfortWithAdjustments) {
        setError('Please indicate your comfort with adjustments.');
        return;
      }
      if (profileStep === 10 && !formData.preferredLighting) {
        setError('Please select your preferred lighting.');
        return;
      }
      if (profileStep === 11 && formData.safeLighting.length === 0) {
        setError('Please select at least one safe lighting type.');
        return;
      }
      if (profileStep === 12 && !formData.dislikedLighting) {
        setError('Please select your least preferred lighting.');
        return;
      }
      if (profileStep === 13 && !formData.notificationPreference) {
        setError('Please select your notification preference.');
        return;
      }
      if (profileStep === 14 && !formData.manualOverride) {
        setError('Please select your manual override preference.');
        return;
      }
      if (profileStep === 15 && !formData.trackEffectiveness) {
        setError('Please indicate if you want to track effectiveness.');
        return;
      }
      if (profileStep === 16 && formData.primaryUsage.length === 0) {
        setError('Please select at least one usage location.');
        return;
      }
      if (profileStep === 17 && !formData.lightNeedsChange) {
        setError('Please indicate if your lighting needs change throughout the day.');
        return;
      }
  
      setError(''); // Clear any old errors
  
      // Check if we're on the last step
      if (profileStep === steps.length - 1) {
        console.log('Completing profile setup');
        try {
          const success = await handleProfileComplete();
          if (success) {
            return;
          }
        } catch (error) {
          console.error('Error completing profile:', error);
          setError('Failed to complete profile setup. Please try again.');
          return;
        }
      }
      
      // Move to next step
      console.log('Moving to next profile step');
      setProfileStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (profileStep > 0) {
      setProfileStep(profileStep - 1);
    }
  };

  const renderSignIn = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Welcome Back</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => setStep('signup')}
          className="text-indigo-600 font-medium hover:text-indigo-500"
          disabled={loading}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
  
  const renderSignUp = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Create Account</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => setStep('signin')}
          className="text-indigo-600 font-medium hover:text-indigo-500"
          disabled={loading}
        >
          Sign In
        </button>
      </p>
    </div>
  );

  const renderProfileStep = () => {
    const currentStep = steps[profileStep];
    console.log('Current step data:', currentStep, 'Step number:', profileStep + 1, 'Total steps:', steps.length);

    // Define emojis and colors for different question types
    const questionStyles = {
      sensitivity: { emoji: '🌡️', color: 'text-orange-600' },
      comfort: { emoji: '😌', color: 'text-green-600' },
      stress: { emoji: '🧘', color: 'text-purple-600' },
      preference: { emoji: '💡', color: 'text-blue-600' },
      control: { emoji: '🎛️', color: 'text-indigo-600' },
      environment: { emoji: '🏠', color: 'text-teal-600' }
    };

    // Determine question type based on step
    const getQuestionType = (step) => {
      if (step <= 3) return 'sensitivity';
      if (step <= 6) return 'comfort';
      if (step <= 9) return 'stress';
      if (step <= 12) return 'preference';
      if (step <= 15) return 'control';
      return 'environment';
    };

    const questionType = getQuestionType(profileStep);
    const style = questionStyles[questionType];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{style.emoji}</span>
            <span className={`text-sm font-medium ${style.color}`}>
              {isProfileEditing ? 'Edit Profile' : questionType.charAt(0).toUpperCase() + questionType.slice(1)} Questions
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Step {profileStep + 1} of {steps.length}
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${style.color}`}>
          {isProfileEditing ? 'Edit Your Profile' : currentStep.title}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {isProfileEditing ? 'Update your profile information below' : currentStep.description}
        </p>
        
        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            error.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            {currentStep.component}
          </div>
          
          <div className="flex justify-between pt-4">
            {profileStep > 0 && (
              <button 
                type="button" 
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                ← Back
              </button>
            )}
            <button 
              type="submit" 
              className={`ml-auto px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                profileStep === steps.length - 1 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? "Loading..." : profileStep === steps.length - 1 
                ? (isProfileEditing ? 'Save Changes' : 'Complete') 
                : 'Next →'}
            </button>
          </div>
        </form>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((profileStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {step === 'signin' && renderSignIn()}
          {step === 'signup' && renderSignUp()}
          {step === 'profile' && renderProfileStep()}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow; 