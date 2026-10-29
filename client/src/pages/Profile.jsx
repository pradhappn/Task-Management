import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import taskService from "../services/Taskservices";
import "../styles/Profile.css";

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Completed",
};

function formatDate(value) {
  if (!value) return "No due date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfileTasks() {
      try {
        const result = await taskService.getAll({
          page: 1,
          limit: 100,
          sortBy: "createdAt",
          order: "desc",
        });
        const allTasks = [...result.tasks];

        for (let page = 2; page <= result.pagination.totalPages; page += 1) {
          const nextPage = await taskService.getAll({
            page,
            limit: 100,
            sortBy: "createdAt",
            order: "desc",
          });
          allTasks.push(...nextPage.tasks);
        }

        if (active) setTasks(allTasks);
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to load your tasks.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfileTasks();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
    } catch (logoutError) {
      console.error("Logout failed:", logoutError);
    } finally {
      navigate("/login", { replace: true });
    }
  }

  const finishedTasks = tasks.filter((task) => task.status === "done");
  const unfinishedTasks = tasks.filter((task) => task.status !== "done");

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <section className="profile-page">
      <header className="profile-heading">
        <div>
          <h2>Your profile</h2>
          <p>Account information and your task progress.</p>
        </div>
      </header>

      <section
        className="profile-card profile-account-card"
        aria-labelledby="profile-account-title"
      >
        <div className="profile-avatar" aria-hidden="true">
          {initials || <i className="bi bi-person" />}
        </div>
        <div className="profile-account-content">
          <h3 id="profile-account-title">{user?.name || "Your account"}</h3>
          <p className="profile-email">{user?.email || "Email unavailable"}</p>
          <span className="profile-account-badge">
            <i className="bi bi-check-circle-fill" />
            Active account
          </span>
        </div>
        <div className="profile-task-summary">
          <div className="profile-task-count">
            <strong>{loading ? "—" : tasks.length}</strong>
            <span>Total tasks</span>
          </div>
          <div className="profile-task-count profile-finished-count">
            <strong>{loading ? "—" : finishedTasks.length}</strong>
            <span>Finished</span>
          </div>
          <div className="profile-task-count profile-unfinished-count">
            <strong>{loading ? "—" : unfinishedTasks.length}</strong>
            <span>Unfinished</span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-danger profile-logout-button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </section>

      {error && (
        <div className="alert alert-danger mb-0" role="alert">
          {error}
        </div>
      )}

      <TaskSection
        title="Unfinished tasks"
        description="Tasks still to do or currently in progress."
        tasks={unfinishedTasks}
        loading={loading}
        emptyMessage="You have no unfinished tasks."
        icon="bi-hourglass-split"
      />

      <TaskSection
        title="Finished tasks"
        description="Tasks you have completed."
        tasks={finishedTasks}
        loading={loading}
        emptyMessage="You have not finished any tasks yet."
        icon="bi-check2-circle"
      />
    </section>
  );
}

function TaskSection({ title, description, tasks, loading, emptyMessage, icon }) {
  return (
    <section className="profile-card profile-tasks-card">
      <div className="profile-section-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="profile-section-count">
          {loading ? "…" : tasks.length}
        </span>
      </div>

      {loading ? (
        <p className="profile-empty-state" role="status">Loading your tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="profile-empty-state">
          <i className={`bi ${icon}`} aria-hidden="true" />
          <p>{emptyMessage}</p>
          <Link to="/" className="btn btn-brand btn-sm">Go to dashboard</Link>
        </div>
      ) : (
        <div className="profile-task-list">
          {tasks.map((task) => (
            <article className="profile-task" key={task._id}>
              <div className="profile-task-main">
                <h4>{task.title}</h4>
                <p>
                  {task.description?.trim() ||
                    task.descreption?.trim() ||
                    "No description added."}
                </p>
              </div>
              <div className="profile-task-meta">
                <span className={`profile-task-status status-${task.status || "todo"}`}>
                  {statusLabels[task.status] || "To do"}
                </span>
                <span className={`priority-badge priority-${task.priority || "medium"}`}>
                  {task.priority || "medium"}
                </span>
                <span className="profile-task-date">
                  <i className="bi bi-calendar3" aria-hidden="true" />
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Profile;
