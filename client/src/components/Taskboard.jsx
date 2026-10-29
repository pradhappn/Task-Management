
import { DragDropContext } from "@hello-pangea/dnd";
import TaskColumn from "./Taskcolumn";
import "../styles/Taskboard.css";

const columns = [
  { title: "To Do", status: "todo" },
  { title: "In Progress", status: "in_progress" },
  { title: "Done", status: "done" },
];

function TaskBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onMoveTask,
  pagination,
  page,
  loading,
  movingTaskId,
  setPage,
}) {
  function handleDragEnd(result) {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid column.
    if (!destination) return;

    // Reordering within the same column isn't saved in this version.
    if (source.droppableId === destination.droppableId) return;

    // Only persist actual status changes.
    onMoveTask(draggableId, destination.droppableId);
  }

  const totalPages = Math.max(pagination?.totalPages ?? 0, 1);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-board">
          {columns.map((column) => (
            <TaskColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={tasks.filter(
                (task) => task.status === column.status
              )}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              isDragDisabled={loading || movingTaskId !== null}
            />
          ))}
        </div>
      </DragDropContext>

      <div className="task-board-pagination d-flex align-items-center justify-content-between gap-3 mt-3">
        <span className="text-secondary small">
          {pagination?.totalTasks ?? 0} tasks · Page {page} of {totalPages}
        </span>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default TaskBoard;
