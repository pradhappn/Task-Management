const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [2, "task title must caontain at least 2 characters"],
            maxlength: [120, "Title cannot ecceed 120 characters"],

        },

        descreption: {
            type: String,
            trim: true,
            maxlength: [2000, "Descreption cannot exceed 2000 characters"],
            default: "",
        },

        status: {
            type: String,
            enum: {
                values: ["todo", "in_progress", "done"],
                message: "status must be todo, in_progress, or done",
            },
            default: "todo",
        },
        priority: {
            type: String,
            enum:{
                values: ["low", "medium", "high"],
                messsage: "priority must be low ,medium, or high",
            },
            default: "medium",
        },
        dueDate: {
            type: Date,
            default: null,
        },
        user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: [true, "Task owner is required"],
  index: true,
},
    },
    {
        timestamp: true,
        versionkey: false,
    }
);

module.exports = mongoose.model("Task", taskSchema)