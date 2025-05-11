import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const HealthTracking = () => {
  const [heartRate, setHeartRate] = useState('');
  const [steps, setSteps] = useState('');
  const [mood, setMood] = useState('neutral');
  const [notes, setNotes] = useState('');
  const [healthData, setHealthData] = useState([]);
  const [error, setError] = useState(null);

  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone || 
               document.referrer.includes('android-app://');

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid, 'healthData', 'manual');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHealthData(docSnap.data().entries || []);
        }
      }
    } catch (err) {
      setError('Failed to load health data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const newEntry = {
        timestamp: new Date().toISOString(),
        heartRate: heartRate ? parseInt(heartRate) : null,
        steps: steps ? parseInt(steps) : null,
        mood,
        notes
      };

      const updatedData = [...healthData, newEntry];
      setHealthData(updatedData);

      await setDoc(doc(db, 'users', user.uid, 'healthData', 'manual'), {
        entries: updatedData
      }, { merge: true });

      // Clear form
      setHeartRate('');
      setSteps('');
      setMood('neutral');
      setNotes('');
      setError(null);

    } catch (err) {
      setError(err.message);
    }
  };

  const renderHealthHistory = () => {
    if (healthData.length === 0) return null;

    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Health History</h3>
        <div className="space-y-4">
          {healthData.slice().reverse().map((entry, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  {entry.heartRate && (
                    <p className="mt-1">Heart Rate: {entry.heartRate} BPM</p>
                  )}
                  {entry.steps && (
                    <p className="mt-1">Steps: {entry.steps}</p>
                  )}
                  <p className="mt-1">Mood: {entry.mood}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {entry.notes && <p>{entry.notes}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Health Tracking</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heart Rate (BPM)
                </label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your heart rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Steps
                </label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your step count"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="happy">Happy</option>
                  <option value="neutral">Neutral</option>
                  <option value="sad">Sad</option>
                  <option value="anxious">Anxious</option>
                  <option value="calm">Calm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Add any notes about how you're feeling"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Save Health Data
              </button>
            </div>
          </div>
        </form>

        {renderHealthHistory()}
      </div>
    </div>
  );
};

export default HealthTracking; 