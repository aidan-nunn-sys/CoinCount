import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}