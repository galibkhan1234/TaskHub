import { useEffect, useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import axios from "axios"
import { Plus, Home, Filter } from "lucide-react"
import TaskCard from "../components/TaskCard"
import TaskModal from "../components/TaskModel"

const API_URL = "http://localhost:8000/api/task"

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext()

  const [filter, setFilter] = useState("All")
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // FILTERED TASKS 
  const filteredTasks = useMemo(() => {
    if (filter === "All") return tasks

    if (filter === "Today") {
      const today = new Date().toDateString()
      return tasks.filter(
        t => t.dueDate && new Date(t.dueDate).toDateString() === today
      )
    }

    if (filter === "Week") {
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      return tasks.filter(
        t => t.dueDate && new Date(t.dueDate) <= weekFromNow
      )
    }

    // Priority filters
    return tasks.filter(
      t => t.priority?.toLowerCase() === filter.toLowerCase()
    )
  }, [tasks, filter])

  // STATS (FIXED)
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      low: tasks.filter(t => t.priority === "low").length,
      medium: tasks.filter(t => t.priority === "medium").length,
      high: tasks.filter(t => t.priority === "high").length,
      urgent: tasks.filter(t => t.priority === "urgent").length,
      completed: tasks.filter(
        t => t.status === "completed" || t.completed === true
      ).length,
      pending: tasks.filter(
        t => t.status !== "completed" && !t.completed
      ).length
    }
  }, [tasks])

  // HANDLERS 
  const handleEditTask = task => {
    setEditingTask(task)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTask(null)
  }

  const handleTaskSaved = () => {
    refreshTasks()
    handleCloseModal()
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Home className="text-purple-600 w-6 h-6" />
            Task Overview
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your tasks efficiently
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition shadow-md"
        >
          <Plus size={18} /> Add New Task
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, emoji: "📋" },
          { label: "Low", value: stats.low, emoji: "🟢" },
          { label: "Medium", value: stats.medium, emoji: "🟡" },
          { label: "High", value: stats.high, emoji: "🔴" },
          { label: "Urgent", value: stats.urgent, emoji: "🚨" }
        ].map(({ label, value, emoji }) => (
          <div
            key={label}
            className="bg-white p-4 rounded-xl border border-purple-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{label} Priority</p>
              <span className="text-2xl">{emoji}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-purple-100">
        <Filter className="w-5 h-5 text-purple-600" />
        <span className="text-sm font-semibold text-gray-700">Filter</span>

        <div className="flex gap-2 flex-wrap ml-auto">
          {["All", "Today", "Week", "High", "Medium", "Low", "Urgent"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${
                filter === f
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No tasks found
          </p>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSaved={handleTaskSaved}
        />
      )}
    </div>
  )
}

export default Dashboard
