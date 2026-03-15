import { useState } from "react";
import { Link } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";

export default function Signup() {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative">

      <FloatingLogo />

      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-10 w-[420px]">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Start building your deployment plan
        </p>

        <input
          type="text"
          placeholder="Username"
          className="w-full mt-6 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mt-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

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

        <button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Sign Up →
        </button>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}