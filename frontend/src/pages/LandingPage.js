import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className={styles.landingContainer}>
      <div className={styles.heroSection}>
        <h1>Track Your Wealth Journey with CoinCount</h1>
        <p>The all-in-one platform for managing your investments, tracking net worth, and building your financial future.</p>
        <div className={styles.ctaButtons}>
          <button 
            className={styles.primaryButton} 
            onClick={() => navigate('/signup')}
          >
            Get Started Free
          </button>
          <button 
            className={styles.secondaryButton} 
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <div className={styles.feature}>
          <i className="fas fa-chart-line"></i>
          <h3>Track Net Worth</h3>
          <p>Monitor your wealth growth in real-time with interactive charts and insights.</p>
        </div>
        <div className={styles.feature}>
          <i className="fas fa-shield-alt"></i>
          <h3>Bank-Level Security</h3>
          <p>Your financial data is protected with enterprise-grade encryption.</p>
        </div>
        <div className={styles.feature}>
          <i className="fas fa-mobile-alt"></i>
          <h3>Access Anywhere</h3>
          <p>Track your finances on any device, anytime, anywhere.</p>
        </div>
      </div>
    </div>
  );
}