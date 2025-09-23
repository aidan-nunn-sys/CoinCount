import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1>Financial Overview</h1>
        <p>Track and manage your accounts</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <i className="fas fa-wallet"></i>
            <h3>Total Balance</h3>
          </div>
          <p className={styles.statValue}>${totalBalance.toLocaleString()}</p>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <i className="fas fa-chart-line"></i>
            <h3>Monthly Change</h3>
          </div>
          <p className={styles.statValue}>+2.4%</p>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <i className="fas fa-university"></i>
            <h3>Active Accounts</h3>
          </div>
          <p className={styles.statValue}>{accounts.length}</p>
        </div>
      </div>

      <div className={styles.accountsSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Accounts</h2>
          <button className={styles.addButton}>
            <i className="fas fa-plus"></i> Add Account
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-piggy-bank"></i>
            <p>No accounts added yet</p>
            <p>Add your first account to start tracking your wealth</p>
          </div>
        ) : (
          <div className={styles.accountsGrid}>
            {accounts.map(account => (
              <div key={account.id} className={styles.accountCard}>
                {/* Account details */}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}