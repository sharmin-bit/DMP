import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";
import axios from "axios";
import { useToast } from "../components/ToastProvider.jsx";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/myapp/auth/login/",
        {
          username: formData.username,
          password: formData.password
        }
      );

      console.log("Login success:", response.data);

      // ✅ STORE TOKENS
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // ✅ STORE ADMIN FLAG
      localStorage.setItem("isAdmin", response.data.is_admin);

      // ✅ SUCCESS TOAST
      toast.push({
        tone: "success",
        title: "Signed in",
        message: "Welcome back.",
      });

      // ✅ ROLE-BASED REDIRECT
      if (response.data.is_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        toast.push({
          tone: "error",
          title: "Login failed",
          message: error.response.data.detail || "Invalid credentials",
        });
      } else {
        toast.push({
          tone: "error",
          title: "Server error",
          message: "Please try again.",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center px-4">
      <FloatingLogo />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 px-8 py-9 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-3xl">
        
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-sky-500/15 to-fuchsia-500/25 opacity-70 blur-3xl" />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Continue crafting your deployment plans.
            </p>
          </div>

          <span className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-400">
            Student build
          </span>
        </div>

        <form onSubmit={handleLogin} className="mt-5 space-y-4">

          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="your-username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 pr-10 text-sm text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-slate-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-4 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-[0.6rem] font-semibold text-indigo-300">
                AI
              </span>
              <span>Prompt-powered deployment planner</span>
            </div>

            <button
              type="button"
              className="text-[0.7rem] font-medium text-slate-400 hover:text-slate-100"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110 disabled:opacity-60"
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>
            <span className="text-xs">→</span>
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-300 underline-offset-4 hover:text-indigo-200 hover:underline"
            >
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}