import { useState, useEffect } from 'react';
import { FaTrash, FaCoins } from 'react-icons/fa';
import containerStyles from '../styles/PageContainer.module.css';
import styles from './HomePage.module.css'; // additional grid styling

export default function HomePage() {
  const [coins, setCoins] = useState(() => JSON.parse(localStorage.getItem('coins')) || []);
  const [coinName, setCoinName] = useState('');
  const [coinValue, setCoinValue] = useState('');

  useEffect(() => {
    localStorage.setItem('coins', JSON.stringify(coins));
  }, [coins]);

  const addCoin = () => {
    if (!coinName.trim() || !coinValue.trim()) return;
    const valueNum = parseFloat(coinValue);
    if (isNaN(valueNum)) return;
    setCoins([...coins, { name: coinName.trim(), value: valueNum }]);
    setCoinName('');
    setCoinValue('');
  };

  const deleteCoin = (index) => setCoins(coins.filter((_, i) => i !== index));

  return (
    <div className={containerStyles.container}>
      <h1><FaCoins /> Home</h1>

      <div className={styles.inputGroup}>
        <input className={containerStyles.input} placeholder="Coin name" value={coinName} onChange={e => setCoinName(e.target.value)} />
        <input className={containerStyles.input} type="number" placeholder="Value" value={coinValue} onChange={e => setCoinValue(e.target.value)} />
        <button className={containerStyles.button} onClick={addCoin}>Add</button>
      </div>

      <div className={styles.coinList}>
        {coins.map((coin, i) => (
          <div key={i} className={styles.coinItem}>
            <span>{coin.name} — ${coin.value.toFixed(2)}</span>
            <FaTrash onClick={() => deleteCoin(i)} style={{ cursor: 'pointer', color: '#e74c3c' }} />
          </div>
        ))}
      </div>
    </div>
  );
}