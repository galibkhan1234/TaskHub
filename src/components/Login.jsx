import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const INITIAL_FORM = {
  email: "",
  password: "",
};

const MESSAGE_ERROR =
  "bg-red-500/15 text-red-300 text-sm p-3 rounded-lg border border-red-500/30 mb-6";

const Login = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_URL = "http://localhost:8000";

  /* 🔁 Auto-login if token exists */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data?.success) {
          toast.success("Session restored");
          navigate("/");
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    })();
  }, [navigate, API_URL]);

  //Login submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("All fields are required");
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/user/login`, formData);

      if (!data.token) {
        throw new Error("Login failed");
      }

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("token", data.token);
      storage.setItem("userId", data.user._id);

      toast.success("Login successful 🎉");

      setFormData(INITIAL_FORM);

// Call onSubmit prop if provided, otherwise navigate
      if (onSubmit) {
        onSubmit({
          email: formData.email,
          name: data.user.name,
          token: data.token,
          userId: data.user._id
        });
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#2F3F1E] via-[#1F2D16] to-[#0F160A] relative overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="hidden md:flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-300 to-emerald-400">
              Cloud-Based Task Manager
            </span>
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-md">
            A cloud-based task management platform that helps teams organize,
            track, and deliver work efficiently.
          </p>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* LOGIN CARD */}
            <form
              onSubmit={handleSubmit}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl text-white"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-3xl font-bold">Welcome Back</h2>
                <p className="text-sm text-gray-300 mt-2">
                  Login to continue TaskHub
                </p>
              </div>

              {error && <div className={MESSAGE_ERROR}>{error}</div>}

              {/* Email */}
              <div className="relative mb-5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/95 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/95 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm mb-6">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-green-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#0f160a] to-[#1F2D16] py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? "Logging in..." : (
                  <>
                    <LogIn className="w-4 h-4"/>
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center text-sm text-gray-300">
              Don't have an account?{" "}
              {onSwitchMode ? (
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="text-green-300 hover:underline font-semibold"
                >
                  Sign up
                </button>
              ) : (
                <Link to="/signup" className="text-green-300 hover:underline font-semibold">
                  Sign up
                </Link>
              )}
            </div>

            {/* SOCIAL LOGIN */}
            <div className="mt-6">
              <div className="relative text-center text-sm text-gray-300">
                Or continue with
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* Google */}
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
                <svg
                  className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-white">Google</span>
              </button>

              {/* Facebook */}
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
                <svg
                  className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-white">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;