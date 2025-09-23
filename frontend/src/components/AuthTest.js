import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');
  const { signup, login, logout, currentUser } = useAuth();

  const handleSignup = async () => {
    try {
      await signup(email, password);
      setMessage('Signup successful!');
    } catch (error) {
      setMessage('Signup error: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      setMessage('Login successful!');
    } catch (error) {
      setMessage('Login error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMessage('Logout successful!');
    } catch (error) {
      setMessage('Logout error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Auth Test</h2>
      <div>
        <p>Current User: {currentUser ? currentUser.email : 'None'}</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={handleLogin}>Log In</button>
        <button onClick={handleLogout}>Log Out</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}