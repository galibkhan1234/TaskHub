import { useState } from "react"
import axios from "axios"
import { MoreVertical, Pencil, Trash2, Calendar, CheckCircle } from "lucide-react"
import { toast } from "react-toastify"

const API_URL = "http://localhost:8000/api/task"

const TaskCard = ({ task, onEdit, onRefresh }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")

  //DELETE 
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return

    try {
      setLoading(true)
      await axios.delete(`${API_URL}/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Task deleted")
      onRefresh()
    } catch {
      toast.error("Delete failed")
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }

  // TOGGLE COMPLETE 
  const handleToggleComplete = async () => {
    try {
      setLoading(true)

      const newStatus =
        task.status === "completed" ? "todo" : "completed"

      await axios.put(
        `${API_URL}/${task._id}`,
        {
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date() : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success("Status updated")
      onRefresh()
    } catch {
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  // UI HELPERS
  const priorityStyles = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200",
    urgent: "bg-purple-100 text-purple-700 border-purple-200"
  }

  const formatDate = date =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })

  const isCompleted = task.status === "completed"

  // RENDER 
  return (
    <div
      className={`border-2 rounded-xl p-5 transition ${
        isCompleted
          ? "bg-green-50 border-green-200"
          : "bg-white border-purple-200 hover:shadow-lg"
      }`}
    >
      <div className="flex justify-between gap-4">
        {/* LEFT */}
        <div className="flex gap-3 flex-1">
          {/* CHECK */}
          <button onClick={handleToggleComplete} disabled={loading}>
            <CheckCircle
              className={`w-5 h-5 ${
                isCompleted
                  ? "text-green-500 fill-green-500"
                  : "text-gray-400 hover:text-purple-500"
              }`}
            />
          </button>

          {/* INFO */}
          <div className="flex-1">
            <h3
              className={`font-semibold ${
                isCompleted && "line-through text-gray-500"
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-gray-600 mt-1">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              {/* PRIORITY */}
              <span
                className={`px-3 py-1 rounded-full border capitalize ${
                  priorityStyles[task.priority]
                }`}
              >
                {task.priority}
              </span>

              {/* DATE */}
              {task.dueDate && (
                <span className="flex items-center gap-1 text-gray-600">
                  <Calendar size={14} />
                  {formatDate(task.dueDate)}
                </span>
              )}

              {/* STATUS */}
              <span
                className={`px-3 py-1 rounded-full text-xs capitalize ${
                  isCompleted
                    ? "bg-green-100 text-green-700"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg z-20 w-40">
              <button
                onClick={() => {
                  onEdit(task)
                  setShowMenu(false)
                }}
                className="flex gap-2 px-4 py-2 hover:bg-purple-50 w-full"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={handleDelete}
                className="flex gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full border-t"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
