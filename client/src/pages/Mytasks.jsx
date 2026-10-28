import { Link } from "react-router-dom";
import "../styles/Mytasks.css";

function MyTasks() {
  return (
    <section className="simple-page">
      <div className="simple-page-icon">
        <i className="bi bi-check2-square" />
      </div>

      <h2>My Tasks</h2>
      <p className="muted-text">
        Your personal task list will appear here.
      </p>

      <Link to="/" className="btn btn-brand">
        Go to Dashboard
      </Link>
    </section>
  );
}

export default MyTasks;