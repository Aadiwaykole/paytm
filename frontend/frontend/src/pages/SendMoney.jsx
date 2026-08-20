import { useEffect, useState } from "react";
import { getBalance, searchUsers, transferMoney } from "../api/client";
import Layout from "../components/Layout";

export default function SendMoney() {
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getBalance()
      .then((res) => setBalance(res.data.balance))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await searchUsers(filter);
        setUsers(response.data.users || []);
      } catch {
        setUsers([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filter]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Please select a user to send money to.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await transferMoney({ to: selectedUser._id, amount: parsedAmount });
      setSuccess(`Successfully sent ₹${parsedAmount.toFixed(2)} to ${selectedUser.firstname}!`);
      setAmount("");
      setSelectedUser(null);
      setFilter("");

      const balanceRes = await getBalance();
      setBalance(balanceRes.data.balance);
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (user) =>
    `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase();

  return (
    <Layout>
      <div className="send-page">
        <div className="page-header">
          <h1>Send Money</h1>
          <p className="subtitle">
            {balance !== null
              ? `Available: ₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
              : "Search for a user and send money instantly"}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="send-grid">
          <section className="panel">
            <h3>Find Recipient</h3>
            <div className="input-group">
              <label htmlFor="search">Search by name</label>
              <input
                id="search"
                type="text"
                placeholder="Type a first or last name..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="user-list">
              {searching && <p className="muted">Searching...</p>}
              {!searching && users.length === 0 && (
                <p className="muted">
                  {filter ? "No users found." : "Start typing to search users."}
                </p>
              )}
              {users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  className={`user-item ${selectedUser?._id === user._id ? "selected" : ""}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <span className="user-avatar">{getInitials(user)}</span>
                  <span className="user-info">
                    <span className="user-name">
                      {user.firstname} {user.lastname}
                    </span>
                    <span className="user-username">@{user.username}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <h3>Transfer Details</h3>
            <form onSubmit={handleTransfer}>
              <div className="input-group">
                <label>Selected Recipient</label>
                <div className="selected-user-display">
                  {selectedUser ? (
                    <>
                      <span className="user-avatar sm">{getInitials(selectedUser)}</span>
                      <span>
                        {selectedUser.firstname} {selectedUser.lastname}
                        <span className="user-username"> @{selectedUser.username}</span>
                      </span>
                    </>
                  ) : (
                    <span className="muted">No user selected</span>
                  )}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!selectedUser}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !selectedUser || !amount}
              >
                {loading ? "Sending..." : "Send Money"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}
