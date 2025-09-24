import { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import styles from './AccountConnection.module.css';

export default function AccountConnection() {
  const [accountType, setAccountType] = useState('');
  const [accountDetails, setAccountDetails] = useState({
    name: '',
    balance: '',
    institution: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const newAccount = {
        ...accountDetails,
        type: accountType,
        id: Date.now().toString(),
        addedDate: new Date().toISOString(),
        balance: parseFloat(accountDetails.balance)
      };

      await updateDoc(userRef, {
        accounts: arrayUnion(newAccount)
      });

      setAccountDetails({ name: '', balance: '', institution: '' });
      setAccountType('');
    } catch (err) {
      setError('Failed to add account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.connectionForm}>
      <h3>Connect New Account</h3>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          required
        >
          <option value="">Select Account Type</option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="investment">Investment</option>
          <option value="crypto">Cryptocurrency</option>
        </select>

        <input
          type="text"
          placeholder="Account Name"
          value={accountDetails.name}
          onChange={(e) => setAccountDetails({...accountDetails, name: e.target.value})}
          required
        />

        <input
          type="number"
          placeholder="Current Balance"
          value={accountDetails.balance}
          onChange={(e) => setAccountDetails({...accountDetails, balance: e.target.value})}
          required
        />

        <input
          type="text"
          placeholder="Institution"
          value={accountDetails.institution}
          onChange={(e) => setAccountDetails({...accountDetails, institution: e.target.value})}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Account'}
        </button>
      </form>
    </div>
  );
}
