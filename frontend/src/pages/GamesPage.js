import { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProfileQuery } from '../hooks/useProfileQuery';
import styles from './GamesPage.module.css';

function deriveAccounts(profile) {
  if (!profile) return [];
  if (Array.isArray(profile.accounts)) return profile.accounts;
  return [];
}

function deriveNetWorth(profile, accounts) {
  if (accounts.length) {
    return accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  }

  const stored = Number(profile?.currentNetWorth ?? profile?.netWorth ?? 0);
  return Number.isFinite(stored) ? stored : 0;
}

export default function GamesPage() {
  const { data: profile, isLoading, isFetching } = useProfileQuery();
  const [multiplier, setMultiplier] = useState(1);

  const accounts = useMemo(() => deriveAccounts(profile), [profile]);
  const netWorth = useMemo(() => deriveNetWorth(profile, accounts), [profile, accounts]);
  const points = useMemo(() => Math.floor(netWorth * multiplier), [netWorth, multiplier]);
  const loading = isLoading || isFetching;

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.section}>
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1>Games & Points</h1>
        <p>Earn points based on your current net worth</p>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.controlButton} ${multiplier === 1 ? styles.active : ''}`}
          onClick={() => setMultiplier(1)}
        >
          1x Points
        </button>
        <button
          className={`${styles.controlButton} ${multiplier === 2 ? styles.active : ''}`}
          onClick={() => setMultiplier(2)}
        >
          2x Points
        </button>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Current Net Worth</h3>
          <p className={styles.statValue}>${netWorth.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Your Points</h3>
          <p className={styles.statValue}>{points.toLocaleString()}</p>
        </div>
      </div>

      {!accounts.length && (
        <div className={styles.section}>
          <h2>No Linked Accounts Yet</h2>
          <p>
            Connect an account from your profile to start generating real-time
            points. We&apos;ll keep your balances in sync so your score updates instantly.
          </p>
        </div>
      )}

      <div className={styles.section}>
        <h2>Coming Soon</h2>
        <p>
          Mini games and challenges will appear here. For now, points are derived
          from your live net worth so you can track progress while we build the fun stuff.
        </p>
      </div>
    </DashboardLayout>
  );
}
