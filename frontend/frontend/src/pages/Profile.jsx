import { useState } from "react";
import { updateProfile } from "../api/client";
import Layout from "../components/Layout";

export default function Profile() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};
    if (formData.firstname.trim()) payload.firstname = formData.firstname.trim();
    if (formData.lastname.trim()) payload.lastname = formData.lastname.trim();
    if (formData.password.trim()) payload.password = formData.password.trim();

    if (Object.keys(payload).length === 0) {
      setError("Please update at least one field.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(payload);
      setSuccess("Profile updated successfully!");
      setFormData({ firstname: "", lastname: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="page-header">
          <h1>Profile Settings</h1>
          <p className="subtitle">Update your personal information</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <section className="panel profile-form-panel">
          <form onSubmit={handleSubmit}>
            <div className="name-row">
              <div className="input-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  placeholder="New first name"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  placeholder="New last name"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}
