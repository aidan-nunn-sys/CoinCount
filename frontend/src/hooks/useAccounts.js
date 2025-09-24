import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'accounts'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setAccounts(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addAccount = async (accountData) => {
    try {
      await addDoc(collection(db, 'accounts'), {
        ...accountData,
        userId: currentUser.uid,
        createdAt: new Date()
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateAccount = async (id, data) => {
    try {
      await updateDoc(doc(db, 'accounts', id), data);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteAccount = async (id) => {
    try {
      await deleteDoc(doc(db, 'accounts', id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount
  };
}