import { useState, useEffect } from "react"
import axios from "axios"
import { X, Plus, CheckCircle } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const API_URL = "http://localhost:8000/api/task"

const TaskModal = ({ task, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    status: "pending"
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        status: task.status || "pending"
      })
    }
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return toast.error("Task title is required")
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      
      // Prepare data to match backend expectations
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status
      }

      // Only add dueDate if it exists
      if (formData.dueDate) {
        taskData.dueDate = formData.dueDate
      }

      console.log("Sending task data:", taskData) // Debug log
      console.log("Token:", token ? "exists" : "missing") // Debug log
      
      if (task?._id) {
        // Update existing task
        const { data } = await axios.put(
          `${API_URL}/${task._id}`,
          taskData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        )
        console.log("Update response:", data) // Debug log
        toast.success("Task updated successfully! 🎉")
      } else {
        // Create new task
        const { data } = await axios.post(
          `${API_URL}/gp`,
          taskData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        )
        console.log("Create response:", data) // Debug log
        toast.success("Task created successfully! 🎉")
      }

      setTimeout(() => {
        onSaved()
      }, 500)
    } catch (error) {
      console.error("Task save error FULL:", error) // Debug log
      console.error("Error response data:", error.response?.data) // Debug log
      console.error("Error response status:", error.response?.status) // Debug log
      console.error("Error message:", error.message) // Debug log
      
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message || 
                       error.message || 
                       "Failed to save task"
      
      toast.error(`Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Modal */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Plus className="w-6 h-6 text-purple-600" />
              {task ? "Edit Task" : "Create New Task"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about your task"
                rows="4"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📌 Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📊 Status
              </label>
              <div className="flex gap-3">
                {["completed", "pending", "in-progress"].map(status => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-purple-600 to-fuchsia-600 text-white py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle size={20} />
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default TaskModal