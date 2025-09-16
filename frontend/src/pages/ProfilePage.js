import containerStyles from '../styles/PageContainer.module.css';

export default function ProfilePage() {
  return (
    <div className={containerStyles.container}>
      <h1>Profile</h1>
      <p>User settings and info can go here.</p>
    </div>
  );
}