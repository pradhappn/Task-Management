import { useEffect, useState } from "react";
import taskService from "../services/Taskservices";
import StatCard from "../components/Statecard";
import TaskBoard from "../components/Taskboard";
import TaskForm from "../components/Taskform";

import "../styles/Dashboard.css";

function Dashboard() {
  // Start empty. Later, the API will provide the task list.
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [movingTaskId, setMovingTaskId] = useState(null);
const [refreshKey, setRefreshKey] = useState(0);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalTasks: 0,
    totalPages: 0,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionPercentage: 0,
  });
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
  let active = true;

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const result = await taskService.getAll({
        page,
        limit: pageSize,
        search,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        order: sortOrder,
      });
      if (!Array.isArray(result.tasks)) {
        throw new Error("The server returned an invalid task list.");
      }

      if (active) {
        setTasks(result.tasks);
        setPagination(result.pagination);
      }

      try {
        const statsData = await taskService.getStats();

        if (active) {
          setStats(statsData);
        }
      } catch (statsError) {
        if (active) {
          setError(
            statsError.message || "Failed to load dashboard statistics."
          );
        }
      }
    } catch (err) {
      if(active) {
        setError(err.message || "Failed to load tasks.");
      }
    }finally {
      if(active) {
        setLoading(false);
      }

    }
  }

  loadTasks();
  return () => {
    active = false;
  };
}, [page, pageSize, search, statusFilter, priorityFilter, sortBy, sortOrder, refreshKey]);

  async function refreshStats() {
    try {
      const latestStats = await taskService.getStats();
      setStats(latestStats);
    } catch (err) {
      setError(
        err.message || "Failed to refresh dashboard statistics."
      );
    }
  }

  async function handleCreateTask(formData) {
    try {
      setError("");

      const createdTask = await taskService.create(formData);

      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      return createdTask;
    } catch (err) {
      setError(err.message || "Failed to create task");
      throw err;
    }
  }

  async function handleUpdateTask(taskId, updates) {
    try {
      setError("");

      const updatedTask = await taskService.update(taskId, updates);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError(err.message || "Failed to update task");
      throw err;
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      setError("");

      await taskService.remove(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete task");
      throw err;
    }
  }


  const visibleTasks = tasks;

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function saveTask(formData) {
    if (editingTask) {
      await handleUpdateTask(editingTask._id, formData);
      setNotice("Task updated successfully.");
    } else {
      await handleCreateTask(formData);
      setNotice("Task created successfully.");
    }

    setFormOpen(false);
    setEditingTask(null);
  }

  async function deleteTask(task) {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    await handleDeleteTask(task._id);

    setNotice("Task deleted successfully.");
  }

  async function changeTaskStatus(task) {
    const nextStatus = {
      todo: "in_progress",
      in_progress: "done",
      done: "todo",
    };

    await handleUpdateTask(task._id, {
      status: nextStatus[task.status],
      updatedAt: new Date().toISOString(),
    });

    setNotice("Task status updated.");
  }

  async function handleMoveTask(taskId, newStatus) {
    const task = tasks.find((item) => item._id === taskId);

    if (!task || task.status === newStatus) return;
    if (movingTaskId !== null) return;

    const statusLabels = {
      todo: "To Do",
      in_progress: "In Progress",
      done: "Done",
    };

    setMovingTaskId(taskId);
    setError("");
    setNotice("");

    try {
      await handleUpdateTask(taskId, {
        status: newStatus,
      });

      await refreshStats();

      setNotice(
        `"${task.title}" moved to ${statusLabels[newStatus] || newStatus}.`
      );

      // Reload the server-paginated task list.
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setError(err.message || "Failed to move task. Please try again.");
    } finally {
      setMovingTaskId(null);
    }
  }

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: "bi-clipboard-check",
      tone: "purple",
      description: "Tasks in your workspace",
    },
    {
      title: "To Do",
      value: stats.todoTasks,
      icon: "bi-list-task",
      tone: "orange",
      description: "Tasks waiting to start",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: "bi-hourglass-split",
      tone: "blue",
      description: "Tasks currently underway",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: "bi-check-circle",
      tone: "green",
      description: "Tasks marked as done",
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: "bi-calendar-x",
      tone: "orange",
      description: "Unfinished past deadlines",
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <h2>Welcome to your workspace</h2>
          <p>Plan your work, focus on priorities, and get things done.</p>
        </div>

        <button
          type="button"
          className="btn btn-brand dashboard-add-button"
          onClick={openCreateForm}
        >
          <i className="bi bi-plus-lg me-2" />
          Add Task
        </button>
      </section>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div
          className="alert alert-success alert-dismissible py-2"
          role="status"
        >
          {notice}
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          />
        </div>
      )}

      <section className="dashboard-stats" aria-label="Task statistics">
        {statCards.map((stat) => (
          <StatCard {...stat} key={stat.title} />
        ))}
      </section>

      <div
        className="progress"
        role="progressbar"
        aria-label="Task completion"
        aria-valuenow={stats.completionPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar"
          style={{ width: `${stats.completionPercentage}%` }}
        />
      </div>

      <section className="board-section">
        <div className="board-toolbar">
          <div>
            <h2>My Board</h2>
            <p className="muted-text mb-0">
              Organize your tasks by progress.
            </p>
          </div>

          <div className="board-search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              aria-label="Search tasks by title"
            />
          </div>
        </div>

        <TaskBoard
          tasks={visibleTasks}
          onEdit={openEditForm}
          onDelete={deleteTask}
          onStatusChange={changeTaskStatus}
          onMoveTask={handleMoveTask}
          pagination={pagination}
          page={page}
          loading={loading}
          movingTaskId={movingTaskId}
          setPage={setPage}
        />
      </section>

      {formOpen && (
        <TaskForm
          task={editingTask}
          onSave={saveTask}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;