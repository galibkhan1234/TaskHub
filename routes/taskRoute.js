import express from "express";
import auth from "../middleware/authTask.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from "../controllers/taskController.js";

const authRouter = express.Router();

// Protect all routes below
authRouter.use(auth);

authRouter.post("/gp", createTask);
authRouter.get("/gp", getTasks);
authRouter.get("/stats", getTaskStats);
authRouter.get("/:id", getTaskById);
authRouter.put("/:id", updateTask);
authRouter.delete("/:id", deleteTask);

export default authRouter;
