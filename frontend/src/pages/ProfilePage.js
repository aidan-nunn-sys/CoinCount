import { useEffect, useMemo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import AccountConnection from '../components/AccountConnection';
import { useAuth } from '../context/AuthContext';
import { useProfileQuery } from '../hooks/useProfileQuery';
import { db } from '../config/firebase';
import styles from './ProfilePage.module.css';

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function resolveAccounts(profile) {
  if (!profile) return [];
  if (Array.isArray(profile.accounts)) return profile.accounts;
  return [];
}

function resolveMemberSince(profile, currentUser) {
  if (profile?.joinedDate) {
    return new Date(profile.joinedDate);
  }

  const created = currentUser?.metadata?.creationTime;
  return created ? new Date(created) : null;
}

export default function ProfilePage() {
  const { data: profile, isLoading, isFetching, isError, error, refetch } = useProfileQuery();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const accounts = useMemo(() => resolveAccounts(profile), [profile]);
  const currentNetWorth = useMemo(
    () => accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0),
    [accounts]
  );

  const maxNetWorth = useMemo(() => {
    const storedMax = Number(profile?.maxNetWorth ?? 0);
    return Math.max(storedMax, currentNetWorth);
  }, [profile?.maxNetWorth, currentNetWorth]);

  const memberSince = useMemo(() => resolveMemberSince(profile, currentUser), [profile, currentUser]);
  const accountCount = accounts.length;
  const lastUpdated = profile?.lastUpdated ? new Date(profile.lastUpdated) : null;

  useEffect(() => {
    if (!currentUser || !profile) return;

    const updates = {};

    if (Number(profile.currentNetWorth ?? 0) !== currentNetWorth) {
      updates.currentNetWorth = currentNetWorth;
    }

    if (Number(profile.maxNetWorth ?? 0) < maxNetWorth) {
      updates.maxNetWorth = maxNetWorth;
    }

    if (Number(profile.accountsCount ?? 0) !== accountCount) {
      updates.accountsCount = accountCount;
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    updates.lastUpdated = new Date().toISOString();

    updateDoc(doc(db, 'users', currentUser.uid), updates)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['profile', currentUser.uid] });
      })
      .catch((err) => {
        console.error('Failed to update profile metrics:', err);
      });
  }, [currentUser, profile, currentNetWorth, maxNetWorth, accountCount, queryClient]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  if (!currentUser) {
    return (
      <DashboardLayout>
        <div className={styles.feedbackCard}>
          <h2>Not signed in</h2>
          <p>You need to sign in to view your profile.</p>
          <div className={styles.feedbackActions}>
            <button className={styles.primaryButton} onClick={() => navigate('/login')}>
              Log in
            </button>
            <button className={styles.secondaryButton} onClick={() => navigate('/signup')}>
              Sign up
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || isFetching) {
    return (
      <DashboardLayout>
        <div className={styles.feedbackCard}>
          <LoadingSpinner />
          <p className={styles.feedbackText}>Loading your profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className={styles.feedbackCard}>
          <h2>Unable to load profile</h2>
          <p>{error?.message ?? 'Something went wrong while fetching your data.'}</p>
          <div className={styles.feedbackActions}>
            <button className={styles.primaryButton} onClick={() => refetch()}>
              Retry
            </button>
            <button className={styles.secondaryButton} onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className={styles.feedbackCard}>
          <h2>No profile data</h2>
          <p>We couldn&apos;t find your profile details. Try refreshing the page.</p>
          <button className={styles.primaryButton} onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Your Profile</h1>
          <p>Review your account details and track your financial progress.</p>
        </div>

        <div className={styles.infoGrid}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Account Details</h2>
              <span className={styles.subtleText}>Manage how you sign in</span>
            </div>
            <div className={styles.infoRow}>
              <span>Email</span>
              <span className={styles.muted}>{currentUser.email}</span>
            </div>
            {currentUser.displayName && (
              <div className={styles.infoRow}>
                <span>Name</span>
                <span className={styles.muted}>{currentUser.displayName}</span>
              </div>
            )}
            <div className={styles.infoRow}>
              <span>Member Since</span>
              <span className={styles.muted}>
                {memberSince ? memberSince.toLocaleDateString() : '—'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span>Last Updated</span>
              <span className={styles.muted}>
                {lastUpdated ? lastUpdated.toLocaleString() : '—'}
              </span>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Sign out
            </button>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Financial Snapshot</h2>
              <span className={styles.subtleText}>Live totals from your linked accounts</span>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statBlock}>
                <span className={styles.statLabel}>Current Net Worth</span>
                <span className={styles.statValue}>{formatCurrency(currentNetWorth)}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statLabel}>Max Net Worth</span>
                <span className={styles.statValue}>{formatCurrency(maxNetWorth)}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statLabel}>Connected Accounts</span>
                <span className={styles.statValue}>{accountCount}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statLabel}>Points Earned</span>
                <span className={styles.statValue}>{Number(profile.points ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.section}>
          <div className={styles.cardHeader}>
            <h2>Connected Accounts</h2>
            <span className={styles.subtleText}>
              Add your financial institutions to keep balances and points up to date.
            </span>
          </div>
          <AccountConnection />
          {!accountCount && (
            <p className={styles.emptyState}>
              No accounts yet. Connect one above to start tracking your progress.
            </p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
