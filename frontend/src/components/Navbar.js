import { NavLink } from 'react-router-dom';
import { FaHome, FaChartLine, FaUser } from 'react-icons/fa';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={({isActive}) => isActive ? styles.active : styles.link}>
        <FaHome size={20} />
        Home
      </NavLink>
      <NavLink to="/networth" className={({isActive}) => isActive ? styles.active : styles.link}>
        <FaChartLine size={20} />
        Net Worth
      </NavLink>
      <NavLink to="/profile" className={({isActive}) => isActive ? styles.active : styles.link}>
        <FaUser size={20} />
        Profile
      </NavLink>
    </nav>
  );
}