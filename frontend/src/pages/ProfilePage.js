import { motion } from 'framer-motion';
import containerStyles from '../styles/PageContainer.module.css';
import cardStyles from '../styles/Card.module.css';
import buttonStyles from '../styles/Buttons.module.css';

const pageTransition = {
  type: "spring",
  stiffness: 80,
  damping: 20,
  duration: 0.5,
  ease: "easeInOut"
};

export default function ProfilePage() {
  return (
    <motion.div
      className={containerStyles.container}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={pageTransition}
    >
      <h1>Profile</h1>

      <motion.div className={cardStyles.card} layout>
        <p><strong>Username:</strong> Demo User</p>
        <p><strong>Email:</strong> demo@example.com</p>

        <div style={{ marginTop: '1rem' }}>
          <button className={buttonStyles.button}>Edit Profile</button>
          <button className={`${buttonStyles.button} ${buttonStyles.active}`} style={{ marginLeft: '0.5rem' }}>
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}