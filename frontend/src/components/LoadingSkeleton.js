import styles from './LoadingSkeleton.module.css';

export function LoadingSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.headerSkeleton} />
      <div className={styles.buttonsSkeleton} />
      <div className={styles.statsSkeleton}>
        <div className={styles.statCardSkeleton} />
        <div className={styles.statCardSkeleton} />
      </div>
      <div className={styles.chartSkeleton} />
    </div>
  );
}