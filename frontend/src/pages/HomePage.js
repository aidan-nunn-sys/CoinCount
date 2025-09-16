import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import containerStyles from "../styles/PageContainer.module.css";
import cardStyles from "../styles/Card.module.css";
import buttonStyles from "../styles/Buttons.module.css";

export default function HomePage() {
  const [accounts, setAccounts] = useState(() => JSON.parse(localStorage.getItem("accounts")) || []);
  const [name, setName] = useState("");
  const [type, setType] = useState("banking");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = () => {
    if (!name.trim() || !balance.trim()) return;
    const valueNum = parseFloat(balance);
    if (isNaN(valueNum)) return;

    const newAcc = {
      id: Date.now(),
      name: name.trim(),
      type,
      balance: valueNum,
    };

    setAccounts([...accounts, newAcc]);
    setName("");
    setBalance("");
  };

  const updateBalance = (id, newBalance) => {
    setAccounts(
      accounts.map(acc => acc.id === id ? { ...acc, balance: parseFloat(newBalance) || 0 } : acc)
    );
  };

  const deleteAccount = (id) => setAccounts(accounts.filter(acc => acc.id !== id));

  // 🔑 Save monthly snapshot
  const saveSnapshot = () => {
    const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    let history = JSON.parse(localStorage.getItem("netWorthHistory")) || [];
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;

    if (!history.find(h => h.date === key)) {
      history.push({ date: key, total });
      localStorage.setItem("netWorthHistory", JSON.stringify(history));
      alert("Snapshot saved!");
    } else {
      alert("Snapshot for this month already exists.");
    }
  };

  const grouped = accounts.reduce((acc, account) => {
    acc[account.type] = acc[account.type] || [];
    acc[account.type].push(account);
    return acc;
  }, {});

  return (
    <div className={containerStyles.container}>
      <h1>Accounts</h1>

      {/* Add Account Form */}
      <div className={cardStyles.card}>
        <h2>Add Account</h2>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            className={containerStyles.input}
            placeholder="Account name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <select
            className={containerStyles.input}
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="banking">Banking</option>
            <option value="investments">Investments</option>
            <option value="cash">Cash</option>
          </select>
          <input
            className={containerStyles.input}
            type="number"
            placeholder="Balance"
            value={balance}
            onChange={e => setBalance(e.target.value)}
          />
          <button className={buttonStyles.button} onClick={addAccount}>Add</button>
        </div>
      </div>

      {/* Account Sections */}
      {Object.keys(grouped).map(type => (
        <div key={type} className={cardStyles.card}>
          <h2 style={{ textTransform: "capitalize" }}>{type}</h2>
          {grouped[type].map(acc => (
            <div key={acc.id} className={cardStyles.listItem}>
              <span>{acc.name}</span>
              <input
                type="number"
                value={acc.balance}
                onChange={e => updateBalance(acc.id, e.target.value)}
                className={containerStyles.input}
                style={{ width: "100px", marginLeft: "0.5rem" }}
              />
              <FaTrash
                onClick={() => deleteAccount(acc.id)}
                style={{ cursor: "pointer", color: "#e74c3c", marginLeft: "0.5rem" }}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Save Snapshot */}
      <button className={buttonStyles.button} onClick={saveSnapshot} style={{ marginTop: "1rem" }}>
        Save Monthly Snapshot
      </button>
    </div>
  );
}