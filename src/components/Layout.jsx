import { useState, useCallback, useEffect, useMemo } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { Circle, TrendingUp, Zap, Clock } from 'lucide-react'

const Layout = ({ onLogout, user }) => {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No auth token found')

      const { data } = await axios.get(
        'http://localhost:8000/api/task/gp',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : []

      setTasks(arr)

    } catch (err) {
      setError(err.message || 'Could not load tasks')
      if (err.response?.status === 401) onLogout()
    } finally {
      setLoading(false)
    }
  }, [onLogout])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t =>
      t.completed === true ||
      t.completed === 1 ||
      (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length

    const totalCount = tasks.length
    const pendingCount = totalCount - completedTasks
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage
    }
  }, [tasks])

  const StatsCard = ({ title, value, icon }) => (
    <div className='p-2 sm:p-3 rounded-xl bg-white shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 group'>
      <div className='flex items-center gap-2'>
        <div className='p-1.5 rounded-lg bg-linear-to-br from-fuchsia-500/15 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20'>
          {icon}
        </div>
        <div>
          <p className='text-lg sm:text-xl font-bold bg-linear-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent'>
            {value}
          </p>
          <p className='text-xs text-gray-500 font-medium'>{title}</p>
        </div>
      </div>
    </div>
  )

  /* LOADING */
  if (loading) return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500' />
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} task={tasks} />

      <div className='ml-0 xl:ml-64 mt-16 p-3 sm:p-4 transition-all duration-300'>
        
        {/* Error Message - Shows but keeps layout visible */}
        {error && (
          <div className='mb-6'>
            <div className='bg-red-50 text-red-600 rounded-xl p-4 border border-red-500 max-w-2xl'>
              <p className='font-medium mb-2'>Error Loading Tasks</p>
              <p className='text-sm mb-3'>{error}</p>
              <button
                onClick={fetchTasks}
                className='py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors'
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
          
          <div className='xl:col-span-2 space-y-4'>
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className='space-y-5'>
            <div className='bg-white rounded-xl p-5 shadow-sm border border-purple-100'>
              <h3 className='text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-purple-500' />
                Task Statistics
              </h3>

              <div className='grid grid-cols-2 gap-4'>
                <StatsCard title='Total Tasks' value={stats.totalCount} icon={<Circle className='w-4 h-4 text-purple-500' />} />
                <StatsCard title='Completed' value={stats.completedTasks} icon={<Circle className='w-4 h-4 text-purple-500' />} />
                <StatsCard title='Pending' value={stats.pendingCount} icon={<Circle className='w-4 h-4 text-purple-500' />} />
                <StatsCard title='Completion Rate' value={`${stats.completionPercentage}%`} icon={<Zap className='w-4 h-4 text-purple-500' />} />
              </div>
            </div>

          {/* Task Progress */}
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                 <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                     <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                     Task Progress
                   </h3>
                     <span className="text-xs text-gray-500">
                    {stats.completedTasks}/{stats.totalCount}
                    </span>
                 </div>

               <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                 <div
                    className="h-full bg-linear-to-r from-fuchsia-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${stats.completionPercentage}%` }}
                   />
                  </div>

                 <p className="text-xs text-gray-500 mt-2">
                   {stats.completionPercentage}% completed
                  </p>
                </div>


            <div className='bg-white rounded-xl p-5 shadow-sm border border-purple-100'>
              <h3 className='text-lg font-semibold mb-4 text-gray-800'>Recent Activity</h3>

              {tasks.length === 0 ? (
                <div className="text-center py-4 sm:py-6 px-2">
                  <div className="w-12 h-12 sm:w-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 sm:w-8 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-500">No recent activity</p>
                  <p className="text-xs text-gray-400 mt-1">Tasks will appear here</p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {tasks.slice(0, 3).map(task => (
                    <div key={task._id || task.id} className='flex justify-between p-3 hover:bg-purple-50 rounded-lg transition-colors'>
                      <p className='text-sm text-gray-700'>
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No date'}
                      </p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.completed ? 'bg-green-100 text-green-700' : 'bg-fuchsia-100 text-fuchsia-700'
                      }`}>
                        {task.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout