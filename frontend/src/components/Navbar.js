import { NavLink } from "react-router-dom";
import { FaHome, FaChartLine, FaUser } from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        <div className={styles.iconText}>
          <FaHome />
          <span>Home</span>
        </div>
      </NavLink>

      <NavLink
        to="/networth"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        <div className={styles.iconText}>
          <FaChartLine />
          <span>Net Worth</span>
        </div>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        <div className={styles.iconText}>
          <FaUser />
          <span>Profile</span>
        </div>
      </NavLink>
    </nav>
  );
}