import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Sparkle, Menu, X } from "lucide-react"
import { menuItems } from "../assets/dummy"

const Sidebar = ({ user, task }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const totalTasks = task?.length || 0
  const completedTasks = task?.filter(t => t.completed).length || 0
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto"
    return () => (document.body.style.overflow = "auto")
  }, [mobileOpen])

  /* ================= MENU ITEMS ================= */
  const MenuItems = ({ onClick }) => (
    <ul className="space-y-1">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            onClick={onClick}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition
              ${
                isActive
                  ? "bg-purple-50 text-purple-700 font-semibold before:absolute before:left-0 before:top-1 before:h-8 before:w-1 before:bg-purple-600 before:rounded-r"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <span className="w-4 h-4">{icon}</span>
            <span>{text}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  /* ================= SIDEBAR CONTENT ================= */
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* USER */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Hey, {username}
            </p>
            <p className="text-xs text-purple-500 flex items-center gap-1">
              <Sparkle className="w-3 h-3" />
              Let’s crush some tasks!
            </p>
          </div>
        </div>
      </div>

      {/* PRODUCTIVITY */}
      <div className="p-4">
        <div className="bg-purple-50 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-purple-600">
              PRODUCTIVITY
            </span>
            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
              {productivity}%
            </span>
          </div>

          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-500 to-fuchsia-500"
              style={{ width: `${productivity}%` }}
            />
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="px-2 flex-1">
        <MenuItems onClick={() => setMobileOpen(false)} />
      </div>

      {/* PRO TIP */}
      <div className="p-4">
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Pro Tip
          </p>
          <p className="text-xs text-gray-600 mb-2">
            Use keyboard shortcuts to boost productivity!
          </p>
          <a
            href="#"
            className="text-xs text-purple-600 font-medium hover:underline"
          >
            Help
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* ================= MOBILE TOGGLE BUTTON ================= */}
      <button
        onClick={() => setMobileOpen(true)}
        className="xl:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 hidden xl:flex">
        <SidebarContent />
      </aside>
    </>
  )
}

export default Sidebar
