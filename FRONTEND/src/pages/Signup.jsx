import { useState } from "react";
import { Link } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center px-4">
      <FloatingLogo />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-900/80 px-8 py-9 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-3xl">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-sky-500/15 to-fuchsia-500/25 opacity-70 blur-3xl" />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
              Create account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Start turning ideas into deployment plans.
            </p>
          </div>
          <span className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-400">
            Free
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Username
            </label>
            <input
              type="text"
              placeholder="your-name"
              className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-indigo-400 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-indigo-400 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 pr-10 text-sm text-slate-100 outline-none ring-0 transition focus:border-indigo-400 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
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

          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110 hover:shadow-[0_20px_60px_rgba(79,70,229,0.7)]">
            <span>Sign up</span>
            <span className="text-xs">→</span>
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-indigo-300 underline-offset-4 hover:text-indigo-200 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}