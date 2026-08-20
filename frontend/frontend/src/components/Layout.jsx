import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <Logo size="sm" />
        <nav className="app-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink to="/send" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Send Money
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Profile
          </NavLink>
        </nav>
        <button type="button" className="btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
