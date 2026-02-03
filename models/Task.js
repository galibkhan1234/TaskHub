import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
      set: v => {
        if (!v) return "todo";

        const map = {
          pending: "todo",
          todo: "todo",
          "in progress": "in-progress",
          inprogress: "in-progress",
          "in-progress": "in-progress",
          completed: "completed",
          done: "completed"
        };

        return map[v.toLowerCase()] || "todo";
      }
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      set: v => v?.toLowerCase()
    },
     dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return value >= today;
        },
        message: "Due date cannot be in the past"
      }
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    createdBy: {
       type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    project: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Indexes
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
