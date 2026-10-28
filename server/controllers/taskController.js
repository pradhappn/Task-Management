const mongoose = require("mongoose");
const Task = require("../models/Task");

const allowedFields = [
  "title",
  "description",
  "status",
  "priority",
  "dueDate",
];

function pickAllowedFields(body) {
  const data = {};

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return data;
  }

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const taskData = pickAllowedFields(req.body);

    const task = await Task.create({
      ...taskData,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/tasks
async function getTasks(req, res, next) {
  try {
    const {
      search = "",
      status,
      priority,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // Validate pagination
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    ) {
      return res.status(400).json({
        message: "Invalid page or limit. Limit must be between 1 and 100.",
      });
    }

    // Build query for the logged-in user only
    const filter = {
      user: req.user._id,
    };

    // Search in title and description
    if (search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    // Validate status and priority
    const allowedStatuses = ["todo", "in_progress", "done"];
    const allowedPriorities = ["low", "medium", "high"];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid task status.",
        });
      }

      filter.status = status;
    }

    if (priority) {
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Invalid task priority.",
        });
      }

      filter.priority = priority;
    }

    // Allow only known fields for sorting
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "title",
      "dueDate",
      "priority",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: "Invalid sort field.",
      });
    }

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        message: "Sort order must be asc or desc.",
      });
    }

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const skip = (pageNumber - 1) * pageSize;

    // Run count and paginated query together
    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(pageSize),
      Task.countDocuments(filter),
    ]);

    return res.status(200).json({
      tasks,
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalTasks,
        totalPages: Math.ceil(totalTasks / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/tasks/:id
async function getTaskById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const updates = pickAllowedFields(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/tasks/stats
async function getTaskStats(req, res, next) {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: "todo" }),
      Task.countDocuments({ user: userId, status: "in_progress" }),
      Task.countDocuments({ user: userId, status: "done" }),
      Task.countDocuments({
        user: userId,
        status: { $ne: "done" },
        dueDate: { $lt: now, $ne: null },
      }),
    ]);

    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return res.status(200).json({
      stats: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        completionPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskStats,
  getTaskById,
  updateTask,
  deleteTask,
};