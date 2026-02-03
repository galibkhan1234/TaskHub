import Task from "../models/Task.js";
import mongoose from "mongoose";

// Helper to check ObjectId equality
const isSameObjectId = (id1, id2) => id1.toString() === id2.toString();

const normalizeStatus = (status) => {
  if (!status) return status;
  const map = {
    "todo": "todo",
    "pending": "todo",
    "in progress": "in-progress",
    "in-progress": "in-progress",
    "completed": "completed",
  
  };
  return map[status.toLowerCase()] || status.toLowerCase();
};

const normalizePriority = (priority) => {
  if (!priority) return priority;
  return priority.toLowerCase();
};


//CREATE TASK
// export const createTask = async (req, res) => {
//   try {
//     const allowedFields = [
//       "title",
//       "description",
//       "status",
//       "priority",
//       "dueDate",
//       "project",
//       "tags"
//     ];

//     const taskData = {};
//     allowedFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         taskData[field] = req.body[field];
//       }
//     });

//     const task = new Task({
//       ...taskData,

//       // REQUIRED FIELDS — ALWAYS SET SERVER-SIDE
//       assignedTo: req.body.assignedTo || req.user.id,
//       createdBy: req.user.id
//     });

//     // Completion logic
//     if (task.status === "completed") {
//       task.completed = true;
//       task.completedAt = new Date();
//     }

//     await task.save();

//     const populatedTask = await Task.findById(task._id)
//       .populate("assignedTo", "name email")
//       .populate("createdBy", "name email");

//     return res.status(201).json({
//       success: true,
//       task: populatedTask
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };



// GET ALL TASKS VISIBLE TO USER
export const createTask = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "project",
      "tags"
    ];

    const taskData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        taskData[field] = req.body[field];
      }
    });

    taskData.status = normalizeStatus(taskData.status);
    taskData.priority = normalizePriority(taskData.priority);

    const task = new Task({
      ...taskData,
      assignedTo: req.user.id, // 🔒 secure
      createdBy: req.user.id
    });

    if (task.status === "completed") {
      task.completed = true;
      task.completedAt = new Date();
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, project } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (project) filter.project = project;

    // User can see tasks assigned to them OR created by them
    filter.$or = [
      { assignedTo: req.user.id },
      { createdBy: req.user.id }
    ];

    const tasks = await Task.find(filter) 
    .populate("assignedTo", "name email")  // Fetch only name and email
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET SINGLE TASK BY ID

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id) 
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    // Access control
    if (!isSameObjectId(task.assignedTo, req.user.id) &&
        !isSameObjectId(task.createdBy, req.user.id)) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// UPDATE TASK

// export const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ success: false, error: "Task not found" });

//     // Access control
//     if (!isSameObjectId(task.assignedTo, req.user.id) &&
//         !isSameObjectId(task.createdBy, req.user.id)) {
//       return res.status(403).json({ success: false, error: "Access denied" });
//     }

//     // Update allowed fields only
//     const allowedFields = [
//       "title", "description", "status",
//       "priority", "assignedTo", "dueDate",
//       "project", "tags"
//     ];
//     allowedFields.forEach(field => {
//       if (req.body[field] !== undefined) task[field] = req.body[field];
//     });

//     // Completion logic
//     if (task.status === "completed" && !task.completed) {
//       task.completed = true;
//       task.completedAt = new Date();
//     } else if (task.status !== "completed") {
//       task.completed = false;
//       task.completedAt = null;
//     }

//     await task.save();

//   const populatedTask = await Task.findById(task._id)
//   .populate("assignedTo", "name email")
//   .populate("createdBy", "name email");
//    res.status(201).json({ success: true, task: populatedTask });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    if (!isSameObjectId(task.assignedTo, req.user.id) &&
        !isSameObjectId(task.createdBy, req.user.id)) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "project",
      "tags"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === "status") task[field] = normalizeStatus(req.body[field]);
        else if (field === "priority") task[field] = normalizePriority(req.body[field]);
        else task[field] = req.body[field];
      }
    });

    if (task.status === "completed") {
      task.completed = true;
      task.completedAt = new Date();
    } else {
      task.completed = false;
      task.completedAt = null;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// DELETE TASK (CREATOR ONLY)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    if (!isSameObjectId(task.createdBy, req.user.id)) {
      return res.status(403).json({ success: false, error: "Only creator can delete" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET TASK STATISTICS

// export const getTaskStats = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const stats = await Task.aggregate([
//       {
//         $match: {
//           $or: [{ assignedTo: mongoose.Types.ObjectId(userId) }, { createdBy: mongoose.Types.ObjectId(userId) }]
//         }
//       },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const total = await Task.countDocuments({
//       $or: [{ assignedTo: userId }, { createdBy: userId }]
//     });

//     res.json({ success: true, stats, total });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
export const getTaskStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Task.aggregate([
      {
        $match: {
          $or: [{ assignedTo: userId }, { createdBy: userId }]
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Task.countDocuments({
      $or: [{ assignedTo: userId }, { createdBy: userId }]
    });

    res.json({ success: true, stats, total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
