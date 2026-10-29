import { useLocation } from "react-router-dom";
import "../styles/Topbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const pageTitles = {
  "/": "Dashboard",
  "/tasks": "My Tasks",
  "/profile": "Profile",
  "/settings": "Settings",
};

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "TaskFlow";

  return (
    <header className="app-topbar">
      <div>
        <p className="topbar-eyebrow mb-1">WORKSPACE</p>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <span className="topbar-date">
          <i className="bi bi-calendar3 me-2" />
          Task workspace
        </span>

        <div className="d-flex align-items-center gap-3">
          <span>{user?.name}</span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;