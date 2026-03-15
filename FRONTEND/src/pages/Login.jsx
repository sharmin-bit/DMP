import { useState } from "react";
import { Link } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">

      <FloatingLogo />

        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-10 w-[420px]">

        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Login to continue
        </p>

        {/* Username or Email */}
        <input
          type="text"
          placeholder="Username or Email"
          className="w-full mt-6 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* Password */}
        <div className="relative mt-4">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            👁
          </button>

        </div>

        <button
        onClick={() => navigate("/dashboard")}
        className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
        Sign In →
        </button>

        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>

      </div>

    </div>
  );
}