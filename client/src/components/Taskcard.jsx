
import { useState } from "react";
import TaskDetails from "./TaskDetails";
import "../styles/Taskcard.css";

function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  provided,
  snapshot,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  return (
    <>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={`task-card-drag-wrapper ${
          snapshot.isDragging ? "is-dragging" : ""
        }`}
      >
        <article className="task-card">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <button
              type="button"
              className="task-card-title-button"
              onClick={() => setShowDetails(true)}
              aria-label={`View details for ${task.title}`}
            >
              <h3 className="task-card-title">{task.title}</h3>
            </button>

            <div className="task-card-actions">
              <button
                type="button"
                className="task-drag-handle"
                {...provided.dragHandleProps}
                aria-label={`Drag ${task.title} to another status`}
                title="Drag to change status"
              >
                <i className="bi bi-grip-vertical" aria-hidden="true" />
              </button>

              <div className="dropdown">
                <button
                  type="button"
                  className="task-menu-button"
                  data-bs-toggle="dropdown"
                  aria-label={`Actions for ${task.title}`}
                >
                  <i className="bi bi-three-dots" />
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => setShowDetails(true)}
                    >
                      <i className="bi bi-eye me-2" />
                      View details
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => onEdit(task)}
                    >
                      <i className="bi bi-pencil me-2" />
                      Edit task
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => onStatusChange(task)}
                    >
                      <i className="bi bi-arrow-left-right me-2" />
                      Change status
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={() => onDelete(task)}
                    >
                      <i className="bi bi-trash me-2" />
                      Delete task
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {task.description && (
            <p className="task-card-description">{task.description}</p>
          )}

          <div className="task-card-meta">
            <span
              className={`priority-badge priority-${task.priority || "medium"}`}
            >
              {task.priority || "medium"}
            </span>

            {formattedDueDate && (
              <span className="task-due-date">
                <i className="bi bi-calendar3 me-1" />
                {formattedDueDate}
              </span>
            )}
          </div>
        </article>
      </div>

      {showDetails && (
        <TaskDetails
          task={task}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            setShowDetails(false);
            onEdit(task);
          }}
        />
      )}
    </>
  );
}

export default TaskCard;
