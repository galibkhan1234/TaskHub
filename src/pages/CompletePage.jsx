import { useMemo, useState } from "react"
import TaskCard from "../components/TaskCard"
import { CheckCircle } from "lucide-react"
import { useOutletContext } from "react-router-dom"

const CompletePage = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [sortBy, setSortBy] = useState("newest")

  // FILTER + SORT 
  const completedTasks = useMemo(() => {
    return tasks
      .filter(
        t => t.status === "completed" || t.completed === true
      )
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.completedAt || b.updatedAt) -
                 new Date(a.completedAt || a.updatedAt)
        }
        if (sortBy === "oldest") {
          return new Date(a.completedAt || a.updatedAt) -
                 new Date(b.completedAt || b.updatedAt)
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
          <CheckCircle className="text-green-500" />
          Completed Tasks
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
      {completedTasks.length === 0 ? (
        <p className="text-gray-500">No completed tasks yet</p>
      ) : (
        <div className="space-y-4">
          {completedTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => {}}
              onRefresh={refreshTasks}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CompletePage
