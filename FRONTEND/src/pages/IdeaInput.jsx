import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { useState } from "react";
import FloatingLogo from "../components/FloatingLogo";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";

export default function IdeaInput() {
  const { projectData, setProjectData } = useContext(ProjectContext);
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const examples = [
    "Food delivery app using React",
    "AI Resume Screener",
    "Task management tool",
    "E-commerce website",
    "Social media dashboard",
    "Fitness tracking app"
  ];

  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4">
      <FloatingLogo />

      {/* Step Progress + top actions */}
      <div className="flex w-full max-w-4xl items-center justify-between pt-2">
        <Stepper currentStep={1} />
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm shadow-slate-900/80 transition hover:border-indigo-400 hover:text-indigo-100"
        >
          Home
        </button>
      </div>

      {/* Main Card */}
      <div className="mt-8 grid w-full max-w-4xl gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <div className="relative rounded-2xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/25 to-sky-500/25 opacity-80 blur-3xl" />

          <h2 className="text-lg font-semibold text-slate-50">
            What’s your idea?
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Describe your project in simple words. No need to be technical.
          </p>

          <textarea
            value={projectData.idea}
            onChange={(e) =>
              setProjectData({ ...projectData, idea: e.target.value })
            }
            placeholder="Example: A simple task manager for students where they can track assignments and deadlines."
            className="mt-4 h-32 w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500"
          />

          <p className="mt-4 text-[0.75rem] text-slate-400">
            Or start from a template:
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setProjectData({ ...projectData, idea: ex })}
                className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-[0.7rem] text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900 hover:text-indigo-100"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/stack")}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110 hover:shadow-[0_22px_70px_rgba(79,70,229,0.7)]"
          >
            <span>Continue to stack</span>
            <span className="text-xs">→</span>
          </button>
        </div>

        {/* Tips Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-5 text-sm text-slate-300 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
          <h3 className="text-sm font-semibold text-slate-50">
            Tips for a clear idea
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-[0.8rem] text-slate-300">
            <li>Explain what your app does in one sentence.</li>
            <li>Mention who will use it (students, sellers, teachers…).</li>
            <li>Add 2–3 main features if you can.</li>
            <li>Don’t worry about tech terms, we’ll handle that later.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}