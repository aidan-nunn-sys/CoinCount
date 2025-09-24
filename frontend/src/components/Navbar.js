import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // If user is not logged in, only show Sign Up if they're not on the signup page
  if (!currentUser) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          CoinCount
        </div>
        {location.pathname !== '/signup' && (
          <button 
            className={styles.signupButton} 
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        )}
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        CoinCount
      </div>
      <div className={styles.navButtons}>
        <button 
          className={styles.navButton} 
          onClick={() => navigate('/dashboard')}
        >
          <i className="fas fa-tachometer-alt"></i>
          Dashboard
        </button>
        <button 
          className={styles.navButton} 
          onClick={() => navigate('/networth')}
        >
          <i className="fas fa-chart-line"></i>
          Net Worth
        </button>
        <button 
          className={styles.navButton} 
          onClick={() => navigate('/games')}
        >
          <i className="fas fa-gamepad"></i>
          Games
        </button>
        <button 
          className={styles.navButton} 
          onClick={() => navigate('/profile')}
        >
          <i className="fas fa-user"></i>
          Profile
        </button>
      </div>
      <button 
        className={styles.logoutButton} 
        onClick={handleLogout}
      >
        <i className="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
