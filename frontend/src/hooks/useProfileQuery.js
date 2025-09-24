import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export function useProfileQuery() {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ['profile', currentUser?.uid],
    queryFn: async () => {
      console.log('Fetching profile for user:', currentUser?.uid);

      if (!currentUser) {
        console.log('No current user found');
        return null;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);

        // Wrap getDoc in a timeout so it fails fast when Firestore is unresponsive.
        const timeoutMs = 8000; // 8 seconds
        const fetchPromise = getDoc(userRef);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore request timed out')), timeoutMs)
        );

        const docSnap = await Promise.race([fetchPromise, timeoutPromise]);

        if (!docSnap.exists()) {
          console.log('Creating new profile');
          const newProfile = {
            points: 0,
            totalEarned: 0,
            gamesPlayed: 0,
            joinedDate: new Date().toISOString(),
            achievements: [],
            lastUpdated: new Date().toISOString()
          };
          await setDoc(userRef, newProfile);
          return newProfile;
        }

        console.log('Profile found:', docSnap.data());
        return docSnap.data();
      } catch (error) {
        // Map common Firestore offline error for clearer UI and logs
        console.error('Profile fetch error:', error?.code ?? error?.message ?? error);

        // Firestore throws message 'Failed to get document because the client is offline.' when offline
        if (String(error?.message || error).includes('client is offline') || String(error?.code || '').includes('offline')) {
          const offlineErr = new Error('Client appears to be offline. Check your network connection.');
          offlineErr.original = error;
          throw offlineErr;
        }

        throw error;
      }
    },
    enabled: !!currentUser,
    // Let react-query retry a few times for intermittent network blips
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * attempt, 5000),
  });
}