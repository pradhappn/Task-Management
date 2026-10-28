
const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");

const router = express.Router();

// Every route below requires a valid login token.
router.use(protect);

router.get("/stats", getTaskStats);

router.route("/")
  .post(createTask)
  .get(getTasks);

router.route("/:id")
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router;
