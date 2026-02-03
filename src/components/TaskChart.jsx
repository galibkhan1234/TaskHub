import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const COLORS = ["#a855f7", "#22c55e"]

const TaskChart = ({ tasks }) => {
  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.length - completed

  const data = [
    { name: "Pending", value: pending },
    { name: "Completed", value: completed }
  ]

  if (tasks.length === 0) return null

  return (
    <div className="bg-white border rounded-xl p-4 h-64">
      <h3 className="font-semibold mb-2">Task Status</h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TaskChart
