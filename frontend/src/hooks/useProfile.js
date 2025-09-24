import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const calculateLevel = (points) => Math.floor(points / 1000) + 1;
  const calculateNextLevelPoints = (level) => level * 1000;

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    async function fetchProfile() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // Initialize new user profile
          const newProfile = {
            points: 0,
            totalEarned: 0,
            gamesPlayed: 0,
            joinedDate: new Date().toISOString(),
            achievements: [],
            lastUpdated: new Date().toISOString()
          };

          await setDoc(userRef, newProfile);
          setProfile(newProfile);
        } else {
          setProfile(docSnap.data());
        }

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying... Attempt ${retryCount} of ${maxRetries}`);
          setTimeout(fetchProfile, retryDelay * retryCount);
        } else {
          setError('Unable to load profile. Please check your internet connection.');
          setLoading(false);
        }
      }
    }

    fetchProfile();

    // Cleanup function
    return () => {
      setProfile(null);
      setLoading(true);
      setError(null);
    };
  }, [currentUser]);

  return { profile, loading, error, calculateLevel, calculateNextLevelPoints };
}