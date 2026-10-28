import { useEffect, useState } from "react";
import "../styles/Taskform.css";

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

function TaskForm({ task, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) {
      setForm(emptyForm);
      setError("");
      return;
    }

    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? "todo",
      priority: task.priority ?? "medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });

    setError("");
  }, [task]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    });
  }

  return (
    <div
      className="task-form-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="task-form-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <header className="task-form-header">
          <div>
            <h2 id="task-form-title">
              {task ? "Edit task" : "Create a task"}
            </h2>
            <p className="muted-text mb-0">
              Add the details you need to stay organized.
            </p>
          </div>

          <button
            type="button"
            className="btn-close"
            aria-label="Close form"
            onClick={onClose}
          />
        </header>

        <form onSubmit={handleSubmit}>
          <div className="task-form-body">
            <div className="mb-3">
              <label htmlFor="task-title" className="form-label">
                Task title <span className="text-danger">*</span>
              </label>
              <input
                id="task-title"
                className={`form-control ${error ? "is-invalid" : ""}`}
                name="title"
                value={form.title}
                onChange={(event) => {
                  handleChange(event);
                  if (error) setError("");
                }}
                maxLength={200}
                required
                autoFocus
                placeholder="What needs to be done?"
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="task-description" className="form-label">
                Description
              </label>
              <textarea
                id="task-description"
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Add some details..."
              />
            </div>

            <div className="row g-3">
              <div className="col-sm-6">
                <label htmlFor="task-status" className="form-label">
                  Status
                </label>
                <select
                  id="task-status"
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="col-sm-6">
                <label htmlFor="task-priority" className="form-label">
                  Priority
                </label>
                <select
                  id="task-priority"
                  className="form-select"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="col-12">
                <label htmlFor="task-due-date" className="form-label">
                  Due date
                </label>
                <input
                  id="task-due-date"
                  className="form-control"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <footer className="task-form-footer">
            <button
              type="button"
              className="btn btn-light border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-brand">
              {task ? "Save changes" : "Create task"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default TaskForm;