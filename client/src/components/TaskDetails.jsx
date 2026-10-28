
import { useEffect } from "react";
import "../styles/TaskDetails.css";

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Completed",
};

function formatDate(date) {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TaskDetails({ task, onClose, onEdit }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const status = statusLabels[task.status] || task.status || "Unknown";
  const priority = task.priority || "medium";

  return (
    <div
      className="task-details-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="task-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
      >
        <header className="task-details-header">
          <div>
            <span className="task-details-eyebrow">TASK DETAILS</span>
            <h2 id="task-details-title">Task overview</h2>
          </div>

          <button
            type="button"
            className="task-details-close"
            onClick={onClose}
            aria-label="Close task details"
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="task-details-content">
          <h3 className="task-details-title">{task.title}</h3>

          <div className="task-details-badges">
            <span
              className={`task-details-status status-${task.status || "todo"}`}
            >
              <span className="task-details-status-dot" />
              {status}
            </span>

            <span className={`priority-badge priority-${priority}`}>
              {priority} priority
            </span>
          </div>

          <div className="task-details-section">
            <h4>
              <i className="bi bi-text-paragraph me-2" />
              Description
            </h4>

            <p className="task-details-description">
              {task.description?.trim() || "No description added yet."}
            </p>
          </div>

          <div className="task-details-section">
            <h4>
              <i className="bi bi-calendar3 me-2" />
              Dates
            </h4>

            <div className="task-details-date-grid">
              <div className="task-details-date-item">
                <span>Due date</span>
                <strong>{formatDate(task.dueDate)}</strong>
              </div>

              {task.createdAt && (
                <div className="task-details-date-item">
                  <span>Created</span>
                  <strong>{formatDate(task.createdAt)}</strong>
                </div>
              )}

              {task.updatedAt && (
                <div className="task-details-date-item">
                  <span>Last updated</span>
                  <strong>{formatDate(task.updatedAt)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="task-details-footer">
          <button
            type="button"
            className="btn btn-light"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onEdit}
          >
            <i className="bi bi-pencil me-2" />
            Edit task
          </button>
        </footer>
      </section>
    </div>
  );
}

export default TaskDetails;
