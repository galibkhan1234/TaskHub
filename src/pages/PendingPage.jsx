import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import TaskCard from "../components/TaskCard"
import TaskModal from "../components/TaskModel"
import { Clock } from "lucide-react"
import { useOutletContext } from "react-router-dom"

const API_URL = "http://localhost:8000/api/task"

const PendingPage = () => {
  const { tasks, refreshTasks } = useOutletContext()

  const [sortBy, setSortBy] = useState("newest")
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(false)

  // FILTER + SORT 
  const pendingTasks = useMemo(() => {
    return tasks
      .filter(
        t => t.status !== "completed" && t.completed !== true
      )
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt)
        }
        if (sortBy === "priority") {
          const order = { urgent: 4, high: 3, medium: 2, low: 1 }
          return (order[b.priority] || 0) - (order[a.priority] || 0)
        }
        return 0
      })
  }, [tasks, sortBy])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="text-yellow-500" />
          Pending Tasks
        </h1>

        {/* SORT */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* CONTENT */}
      {pendingTasks.length === 0 ? (
        <p className="text-gray-500">No pending tasks 🎉</p>
      ) : (
        <div className="space-y-4">
          {pendingTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={setEditingTask}
              onRefresh={refreshTasks}
            />
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSaved={() => {
            setEditingTask(null)
            refreshTasks()
          }}
        />
      )}
    </div>
  )
}

export default PendingPage
