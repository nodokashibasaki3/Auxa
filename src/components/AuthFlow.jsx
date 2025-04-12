import React, { useState } from 'react';

const AuthFlow = ({ onComplete }) => {
  const [step, setStep] = useState('signin'); // signin, signup, profile
  const [profileStep, setProfileStep] = useState(0); // 0: DOB, 1: Diagnosis, 2: Autism Type, 3: Light Sensitivity
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dateOfBirth: '',
    diagnosisType: '',
    autismType: '',
    selfDiagnosed: false,
    lightSensitivity: 3
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (step === 'signin') {
      // Simulate fetching existing user data
      const existingUser = {
        email: formData.email,
        password: formData.password,
        name: 'Jane Doe',
        dateOfBirth: '2000-01-01',
        diagnosisType: 'professional',
        autismType: 'aspergers',
        selfDiagnosed: false,
        lightSensitivity: 4
      };
  
      setFormData(existingUser); // load into form
      onComplete(existingUser); // skip profile setup for signed-in user
    } else if (step === 'signup') {
      // Empty profile steps start after sign up
      setFormData((prev) => ({
        ...prev,
        email: prev.email,
        password: prev.password
      }));
      setStep('profile');
    } else if (step === 'profile') {
      if (profileStep < 3) {
        setProfileStep(profileStep + 1);
      } else {
        onComplete(formData); // done with setup
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
    const steps = [
      {
        title: "When were you born?",
        description: "This helps us personalize your experience",
        component: (
          <div>
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
          <div className="space-y-2">
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
          <div>
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
          <div>
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

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full">
        <div className="mb-2 text-sm text-indigo-600">Step {profileStep + 1} of {steps.length}</div>
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">{currentStep.title}</h2>
        <p className="text-sm text-gray-600 mb-6">{currentStep.description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep.component}
          
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
              {profileStep === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 p-4">
      <div className="max-w-md w-full">
        {step === 'signin' && renderSignIn()}
        {step === 'signup' && renderSignUp()}
        {step === 'profile' && renderProfileStep()}
      </div>
    </div>
  );
};

export default AuthFlow; 