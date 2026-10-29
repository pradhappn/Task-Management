import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const navigationItems = [
  { label: "Dashboard", path: "/", icon: "bi-grid-1x2" },
  { label: "My Tasks", path: "/tasks", icon: "bi-check2-square" },
  { label: "Profile", path: "/profile", icon: "bi-person-circle" },
  { label: "Settings", path: "/settings", icon: "bi-gear" },
];

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <NavLink to="/" className="brand-logo">
        <span className="brand-mark">
          <i className="bi bi-check2-all" />
        </span>
        <span>TaskFlow</span>
      </NavLink>

      <p className="sidebar-label">WORKSPACE</p>

      <nav className="sidebar-navigation" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-icon">
          <i className="bi bi-lightbulb" />
        </div>
        <p className="fw-semibold mb-1">Stay productive</p>
        <p className="muted-text small mb-0">
          Organize your work, one task at a time.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;