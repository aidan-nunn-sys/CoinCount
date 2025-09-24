import React, { useState, useMemo } from "react";
import { Line } from 'react-chartjs-2';
import { useQuery } from "@tanstack/react-query";
import { useAccounts } from '../hooks/useAccounts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { format, subMonths, subYears } from "date-fns";

import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./NetWorthPage.module.css";

// Chart registration stays outside
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Pre-defined chart options stay outside
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300 // Reduce animation duration
  },
  plugins: {
    legend: {
      position: "top",
      labels: { color: "#a0aec0" },
    },
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: false,
      backgroundColor: "rgba(26, 31, 44, 0.95)",
      titleColor: "#fff",
      bodyColor: "#a0aec0",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      padding: 12,
      bodySpacing: 4,
      titleSpacing: 4,
      cornerRadius: 8,
      usePointStyle: true,
      callbacks: {
        label: (context) => `$${context.raw.toLocaleString()}`,
      },
    },
  },
  scales: {
    y: {
      grid: { color: "rgba(255, 255, 255, 0.1)" },
      ticks: {
        color: "#a0aec0",
        callback: (value) => `$${value.toLocaleString()}`,
      },
    },
    x: {
      grid: { color: "rgba(255, 255, 255, 0.1)" },
      ticks: { color: "#a0aec0" },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
};

const timeframes = [
  { label: "1M", value: "1month" },
  { label: "3M", value: "3months" },
  { label: "6M", value: "6months" },
  { label: "1Y", value: "1year" },
  { label: "ALL", value: "all" },
];

export default function NetWorthPage() {
  const [timeframe, setTimeframe] = useState("3months");
  const { accounts: rawAccounts } = useAccounts(); // Call hook at component level

  // Use React Query with the accounts data
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => rawAccounts,
    staleTime: 30000,
    cacheTime: 3600000,
    enabled: !!rawAccounts // Only run query when rawAccounts is available
  });

  // Optimize data calculations
  const { netWorthData, chartData, currentNetWorth } = useMemo(() => {
    if (!accounts?.length) {
      return { netWorthData: [], chartData: null, currentNetWorth: 0 };
    }

    const now = new Date();
    const dateRange = {
      "1month": subMonths(now, 1),
      "3months": subMonths(now, 3),
      "6months": subMonths(now, 6),
      "1year": subYears(now, 1),
      "all": new Date(Math.min(...accounts.map(a => new Date(a.createdAt))))
    };

    const startDate = dateRange[timeframe];
    const filteredData = accounts
      .filter(account => new Date(account.createdAt) >= startDate)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const labels = filteredData.map(d => format(new Date(d.createdAt), "MMM d"));
    const values = filteredData.map(d => d.balance);
    
    return {
      netWorthData: filteredData,
      chartData: {
        labels,
        datasets: [{
          label: "Net Worth",
          data: values,
          borderColor: "#00b4db",
          backgroundColor: "rgba(0, 180, 219, 0.1)",
          tension: 0.4,
          fill: true,
        }]
      },
      currentNetWorth: accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)
    };
  }, [accounts, timeframe]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1>Net Worth Overview</h1>
        <p>Track your wealth growth over time</p>
      </div>

      <div className={styles.timeframeButtons}>
        {timeframes.map(({ label, value }) => (
          <button
            key={value}
            className={`${styles.timeframeButton} ${
              timeframe === value ? styles.active : ""
            }`}
            onClick={() => setTimeframe(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Current Net Worth</h3>
          <p className={styles.statValue}>
            ${currentNetWorth.toLocaleString()}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Period Change</h3>
          <p className={styles.statValue}>
            {calculatePeriodChange(netWorthData)}%
          </p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>
    </DashboardLayout>
  );
}

function calculatePeriodChange(data) {
  if (data.length < 2) return "0.00";
  const oldValue = Number(data[0].balance);
  const newValue = Number(data[data.length - 1].balance);
  const change = ((newValue - oldValue) / oldValue) * 100;
  return change.toFixed(2);
}