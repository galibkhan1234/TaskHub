import React, { useState } from "react";
import axios from "axios";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FIELDS = [
  { name: "name", type: "text", placeholder: "Full Name", icon: User },
  { name: "email", type: "email", placeholder: "Email Address", icon: Mail },
  { name: "password", type: "password", placeholder: "Password", icon: Lock }
];

const MESSAGE_ERROR =
  "bg-red-500/15 text-red-300 text-sm p-3 rounded-lg border border-red-500/30 mb-6";

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  password: ""
};

const Signup = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setLoading(false);
      return setError("All fields are required");
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/user/register",
        payload
      );

      console.log("Signup successful:", data);

      toast.success("Account created successfully! 🎉");
      setFormData(INITIAL_FORM_DATA);

      // Call onSubmit prop if provided, otherwise navigate to login
      if (onSubmit) {
        onSubmit({
          email: formData.email,
          name: formData.name
        });
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }

    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Signup failed. Please try again.";
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2F3F1E] via-[#1F2D16] to-[#0f160a] relative overflow-hidden">
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
            Join{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
              Cloud-Based Task Manager
            </span>
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-md">
            Create your account and start organizing your tasks efficiently with our cloud-based platform.
          </p>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubmit}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl text-white"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-3xl font-bold">Create Account</h2>
                <p className="text-sm text-gray-300 mt-2">
                  Join TaskHub and start managing tasks
                </p>
              </div>

              {error && <div className={MESSAGE_ERROR}>{error}</div>}

              <div className="space-y-5">
                {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
                  <div key={name} className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300" />
                    <input
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/95 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-linear-to-r from-[#0f160a] to-[#1F2D16] py-3.5 rounded-xl font-semibold"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>

              <p className="text-center text-sm text-gray-300 mt-6">
                Already have an account?{" "}
                {onSwitchMode ? (
                  <button
                    type="button"
                    onClick={onSwitchMode}
                    className="text-green-300 hover:underline font-semibold"
                  >
                    Login
                  </button>
                ) : (
                  <Link to="/login" className="text-green-300 hover:underline font-semibold">
                    Login
                  </Link>
                )}
              </p>
            </form>

            {/* SOCIAL SIGNUP */}
            <div className="mt-6">
              <div className="relative text-center text-sm text-gray-300">
                Or sign up with
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

export default Signup;