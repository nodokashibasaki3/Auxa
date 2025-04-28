import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthFlow from '../components/AuthFlow';

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  const handleComplete = (profileData) => {
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <AuthFlow onComplete={handleComplete} isEditing={isEditing} />
    </div>
  );
};

export default ProfilePage; 