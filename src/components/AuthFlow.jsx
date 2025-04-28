import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AuthFlow = ({ onComplete, isEditing = false }) => {
  const [step, setStep] = useState(isEditing ? 'profile' : 'signin');
  const [profileStep, setProfileStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dateOfBirth: '',
    diagnosisType: '',
    autismType: '',
    selfDiagnosed: false,
    lightSensitivity: 1
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        onComplete(userDoc.data());
      } else {
        setError('User profile not found');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Store initial user data
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        name: formData.name
      });
      
      // Clear profile fields
      setFormData(prev => ({
        ...prev,
        dateOfBirth: '',
        diagnosisType: '',
        autismType: '',
        selfDiagnosed: false,
        lightSensitivity: 1
      }));
      
      // Move to profile setup
      setStep('profile');
      setProfileStep(0);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfileComplete = async () => {
    try {
      // Get the current user
      let user = auth.currentUser;
      
      if (!user) {
        // If no current user, try to sign in with existing credentials
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        user = userCredential.user;
      }

      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update the user's profile with all collected information
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        diagnosisType: formData.diagnosisType,
        autismType: formData.autismType,
        selfDiagnosed: formData.selfDiagnosed,
        lightSensitivity: formData.lightSensitivity
      }, { merge: true });
      
      // Call onComplete first to update the parent component's state
      onComplete({
        email: formData.email,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        diagnosisType: formData.diagnosisType,
        autismType: formData.autismType,
        selfDiagnosed: formData.selfDiagnosed,
        lightSensitivity: formData.lightSensitivity
      });
      
      // Then navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error in handleProfileComplete:', error);
      setError(error.message);
    }
  };

  // Load profile data when in edit mode
  useEffect(() => {
    if (isEditing) {
      loadProfileData();
    }
  }, [isEditing]);

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
          lightSensitivity: data.lightSensitivity || 1
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

      // Update the user's profile with all collected information
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        diagnosisType: formData.diagnosisType,
        autismType: formData.autismType,
        selfDiagnosed: formData.selfDiagnosed,
        lightSensitivity: formData.lightSensitivity
      }, { merge: true });
      
      // Call onComplete to update the parent component's state
      onComplete({
        email: formData.email,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        diagnosisType: formData.diagnosisType,
        autismType: formData.autismType,
        selfDiagnosed: formData.selfDiagnosed,
        lightSensitivity: formData.lightSensitivity
      });
      
      // Show success message
      setError('Profile updated successfully!');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

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
      // Light sensitivity is always filled (default 1), so no need to validate step 3.
  
      setError(''); // Clear any old errors
  
      if (profileStep < 3) {
        console.log('Moving to next profile step');
        setProfileStep(prev => prev + 1);
      } else {
        console.log('Completing profile setup');
        if (isEditing) {
          await handleEditProfile();
        } else {
          await handleProfileComplete();
        }
      }
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
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => setStep('signup')}
          className="text-indigo-600 font-medium hover:text-indigo-500"
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
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">
          Create Account
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => setStep('signin')}
          className="text-indigo-600 font-medium hover:text-indigo-500"
        >
          Sign In
        </button>
      </p>
    </div>
  );

  const renderProfileStep = () => {
    console.log('renderProfileStep called with profileStep:', profileStep);
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
            <label className="flex items-center">
              <input
                type="radio"
                name="diagnosisType"
                value="professional"
                checked={formData.diagnosisType === 'professional'}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Professionally Diagnosed</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="diagnosisType"
                value="self"
                checked={formData.diagnosisType === 'self'}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Self-Diagnosed</span>
            </label>
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
              <option value="autism">Autism</option>
              <option value="aspergers">Asperger's Syndrome</option>
              <option value="pdd-nos">PDD-NOS</option>
              <option value="other">Other</option>
            </select>
          </div>
        )
      },
      {
        title: "How sensitive are you to bright lights?",
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
              <span>Very sensitive</span>
            </div>
          </div>
        )
      }
    ];

    const currentStep = steps[profileStep];
    console.log('Current step data:', currentStep);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
        <div className="mb-2 text-sm text-indigo-600">Step {profileStep + 1} of {steps.length}</div>
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">{currentStep.title}</h2>
        <p className="text-sm text-gray-600 mb-6">{currentStep.description}</p>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            {currentStep.component}
          </div>
          
          <div className="flex justify-between pt-4">
            {profileStep > 0 && (
              <button 
                type="button" 
                onClick={handleBack}
                className="px-4 py-2 text-indigo-600 font-medium"
              >
                Back
              </button>
            )}
            <button 
              type="submit" 
              className="ml-auto bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium"
            >
              {profileStep === steps.length - 1 ? (isEditing ? 'Save Changes' : 'Complete') : 'Next'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {step === 'signin' && renderSignIn()}
        {step === 'signup' && renderSignUp()}
        {step === 'profile' && (
          <div className="animate-fade-in">
            {renderProfileStep()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFlow; 