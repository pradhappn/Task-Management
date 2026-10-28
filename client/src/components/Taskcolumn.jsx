
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./Taskcard";
import "../styles/Taskcolumn.css";

function TaskColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  isDragDisabled,
}) {
  return (
    <section className="task-column">
      <header className="task-column-header">
        <div className="d-flex align-items-center gap-2">
          <span className={`status-dot dot-${status}`} />
          <h2 className="task-column-title">{title}</h2>
          <span className="task-count">{tasks.length}</span>
        </div>
      </header>

      <Droppable
        droppableId={status}
        isDropDisabled={isDragDisabled}
      >
        {(dropProvided, dropSnapshot) => (
          <div
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            className={`task-column-list ${
              dropSnapshot.isDraggingOver
                ? "task-column-list-drag-over"
                : ""
            }`}
          >
            {tasks.length === 0 && (
              <div className="task-empty-state">
                <i className="bi bi-inbox" aria-hidden="true" />
                <p>No tasks here yet</p>
              </div>
            )}

            {tasks.map((task, index) => (
              <Draggable
                key={task._id}
                draggableId={String(task._id)}
                index={index}
                isDragDisabled={isDragDisabled}
              >
                {(dragProvided, dragSnapshot) => (
                  <TaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    provided={dragProvided}
                    snapshot={dragSnapshot}
                  />
                )}
              </Draggable>
            ))}

            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}

export default TaskColumn;
