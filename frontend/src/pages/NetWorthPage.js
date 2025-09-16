import { useState } from "react";
import { motion } from "framer-motion";
import containerStyles from "../styles/PageContainer.module.css";
import cardStyles from "../styles/Card.module.css";
import buttonStyles from "../styles/Buttons.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function NetWorthPage() {
  const [history, setHistory] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("netWorthHistory")) || [];
    // Ensure every snapshot has accounts array
    return saved.map((h) => ({ ...h, accounts: h.accounts || [] }));
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const saveHistory = (updated) => {
    setHistory(updated);
    localStorage.setItem("netWorthHistory", JSON.stringify(updated));
  };

  // ➕ Add snapshot for current month
  const addSnapshot = () => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-01`;

    let updated = [...history];
    const existingIndex = updated.findIndex((s) => s.date === monthKey);

    if (existingIndex !== -1) {
      setEditingIndex(existingIndex); // open existing snapshot
      return;
    }

    const lastSnapshot = updated[updated.length - 1];
    const newAccounts = lastSnapshot ? lastSnapshot.accounts.map((a) => ({ ...a })) : [];

    updated.push({ date: monthKey, accounts: newAccounts });
    updated.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveHistory(updated);

    setEditingIndex(updated.findIndex((s) => s.date === monthKey));
  };

  const updateAccountBalance = (snapshotIndex, accountIndex, newBalance) => {
    const updated = [...history];
    updated[snapshotIndex].accounts[accountIndex].balance = parseFloat(newBalance) || 0;
    saveHistory(updated);
  };

  const addAccountToSnapshot = (snapshotIndex) => {
    const name = prompt("Account name:");
    if (!name) return;
    const type = prompt("Account type (Banking, Investment, Other):", "Banking");
    const balance = parseFloat(prompt("Starting balance:") || "0");

    const updated = [...history];
    updated[snapshotIndex].accounts.push({
      id: `${Date.now()}`,
      name,
      type,
      balance: isNaN(balance) ? 0 : balance,
    });
    saveHistory(updated);
  };

  const deleteSnapshot = (index) => {
    const updated = history.filter((_, i) => i !== index);
    saveHistory(updated);
  };

  // chart data with safeguards
  const data = history.map((h) => ({
    name: new Date(h.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    value: (h.accounts || []).reduce((sum, acc) => sum + acc.balance, 0),
  }));

  const latest = data.length ? data[data.length - 1].value : 0;

  return (
    <motion.div
      className={containerStyles.container}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      <h1>Net Worth</h1>

      {/* Add Snapshot */}
      <button className={buttonStyles.button} onClick={addSnapshot}>
        Add Snapshot (This Month)
      </button>

      {/* Chart */}
      <motion.div className={cardStyles.card} layout style={{ marginTop: "1rem" }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Latest total */}
      <motion.div
        className={cardStyles.card}
        style={{ marginTop: "1rem", textAlign: "center" }}
      >
        <h2>Total Net Worth</h2>
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#4f46e5" }}>
          ${latest.toFixed(2)}
        </p>
      </motion.div>

      {/* History List */}
      <motion.div className={cardStyles.card} style={{ marginTop: "1rem" }}>
        <h2>History</h2>
        {history.map((h, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span>
              {new Date(h.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <div>
              <button
                onClick={() => setEditingIndex(i)}
                style={{ marginRight: "0.5rem" }}
              >
                Edit
              </button>
              <button onClick={() => deleteSnapshot(i)} style={{ color: "red" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Edit Modal */}
      {editingIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
          onClick={() => setEditingIndex(null)}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              Edit{" "}
              {new Date(history[editingIndex].date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            {(history[editingIndex].accounts || []).map((acc, j) => (
              <div key={j} style={{ marginBottom: "0.5rem" }}>
                <label>
                  {acc.name} ({acc.type})
                </label>
                <input
                  type="number"
                  value={acc.balance}
                  onChange={(e) =>
                    updateAccountBalance(editingIndex, j, e.target.value)
                  }
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>
            ))}
            <button
              className={buttonStyles.button}
              style={{ marginTop: "1rem" }}
              onClick={() => addAccountToSnapshot(editingIndex)}
            >
              Add Account
            </button>
            <button
              className={buttonStyles.button}
              style={{ marginTop: "1rem", marginLeft: "0.5rem" }}
              onClick={() => setEditingIndex(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}