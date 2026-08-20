import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBalance } from "../api/client";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getBalance();
        setBalance(response.data.balance);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const formatBalance = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount ?? 0);

  return (
    <Layout>
      <div className="dashboard">
        <section className="balance-card">
          <p className="balance-label">Available Balance</p>
          {loading ? (
            <div className="balance-amount skeleton">₹ ----</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : (
            <h2 className="balance-amount">{formatBalance(balance)}</h2>
          )}
          <p className="balance-hint">Your wallet is ready for transfers</p>
        </section>

        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <Link to="/send" className="action-card">
              <span className="action-icon send">↗</span>
              <span className="action-title">Send Money</span>
              <span className="action-desc">Pay friends instantly</span>
            </Link>
            <Link to="/profile" className="action-card">
              <span className="action-icon profile">👤</span>
              <span className="action-title">Profile</span>
              <span className="action-desc">Update your details</span>
            </Link>
          </div>
        </section>

        <section className="info-banner">
          <div className="info-banner-content">
            <h4>Secure & Instant Transfers</h4>
            <p>Send money to anyone on Paytm using their username. Transactions are processed in real time.</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
