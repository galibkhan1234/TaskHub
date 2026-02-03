import { useEffect, useState } from "react"
import {
  User,
  Mail,
  Lock,
  Save,
  LogOut,
  ArrowLeft,
  UserCircle,
  Shield,
} from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"

const API_URL = "http://localhost:8000/api/user"

const Profile = ({ setCurrentUser, onLogout }) => {
  const navigate = useNavigate()

  //STATE 
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // LOAD CURRENT USER
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    axios
      .get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.success) {
          setProfile({
            name: data.user.name,
            email: data.user.email,
          })
        } else {
          toast.error(data.message)
        }
      })
      .catch(() => toast.error("Failed to load profile"))
  }, [])

  // SAVE PROFILE 
  const handleSaveProfile = async (e) => {
    e.preventDefault()

    if (!profile.name || !profile.email) {
      return toast.error("Name and email are required")
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const { data } = await axios.put(
        `${API_URL}/profile`,
        {
          name: profile.name,
          email: profile.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.user.name
          )}&background=random`,
        }))

        toast.success("Profile updated successfully")
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed")
    } finally {
      setLoading(false)
    }
  }

  // CHANGE PASSWORD 
  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!password.current || !password.new || !password.confirm) {
      return toast.error("All password fields are required")
    }

    if (password.new !== password.confirm) {
      return toast.error("Passwords do not match")
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const { data } = await axios.put(
        `${API_URL}/update`,
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data.success) {
        toast.success("Password changed successfully")
        setPassword({ current: "", new: "", confirm: "" })
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed")
    } finally {
      setLoading(false)
    }
  }

  // UI
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-purple-600 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-bold">
          {profile.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Account Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your profile and security
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* PERSONAL INFO */}
        <section className="bg-white rounded-xl p-6 border space-y-5">
          <div className="flex items-center gap-2">
            <UserCircle className="text-purple-600" />
            <h2 className="font-semibold text-lg">Personal Information</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-purple-500" />
              <input
                name="name"
                type="text"
                placeholder="Full name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full pl-10 p-3 rounded-lg border"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-500" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full pl-10 p-3 rounded-lg border"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white p-3 rounded-lg"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </form>
        </section>

        {/* SECURITY */}
        <section className="bg-white rounded-xl p-6 border space-y-5">
          <div className="flex items-center gap-2">
            <Shield className="text-purple-600" />
            <h2 className="font-semibold text-lg">Security</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <input
              name="currentPassword"
              type="password"
              placeholder="Current password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
              className="w-full p-3 rounded-lg border"
            />

            <input
              name="newPassword"
              type="password"
              placeholder="New password"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
              className="w-full p-3 rounded-lg border"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
              className="w-full p-3 rounded-lg border"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white p-3 rounded-lg"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </form>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-600 p-3 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </section>
      </div>
    </div>
  )
}

export default Profile

