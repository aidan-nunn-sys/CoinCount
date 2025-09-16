import { useState } from 'react';
import containerStyles from '../styles/PageContainer.module.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function NetWorthPage() {
  const [timeframe, setTimeframe] = useState('monthly');
  const coins = JSON.parse(localStorage.getItem('coins')) || [];

  const totalValue = coins.reduce((sum, c) => sum + c.value, 0);

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if (timeframe === 'monthly') {
      for (let i = 0; i < 12; i++) data.push({ name: months[i], value: totalValue * (Math.random() * 0.3 + 0.85) });
    } else if (timeframe === 'yearly') {
      const year = new Date().getFullYear();
      for (let i = year - 4; i <= year; i++) data.push({ name: i.toString(), value: totalValue * (Math.random() * 0.5 + 0.75) });
    } else {
      for (let i = 2015; i <= new Date().getFullYear(); i++) data.push({ name: i.toString(), value: totalValue * (Math.random() * 0.7 + 0.5) });
    }
    return data;
  };

  const data = generateChartData();

  return (
    <div className={containerStyles.container}>
      <h1>Net Worth</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        {['monthly','yearly','all'].map(tf => (
          <button
            key={tf}
            className={timeframe === tf ? containerStyles.button : ''}
            onClick={() => setTimeframe(tf)}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}