import { useContext, useState } from "react";
import axios from "axios";
import { ProjectContext } from "../context/ProjectContext";
import FloatingLogo from "../components/FloatingLogo";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";

export default function IdeaInput() {

  const { projectData, setProjectData } = useContext(ProjectContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const examples = [
    "Food delivery app using React",
    "AI Resume Screener",
    "Task management tool",
    "E-commerce website",
    "Social media dashboard",
    "Fitness tracking app"
  ];

  const handleContinue = async () => {

  if (!projectData.idea) {
    alert("Please enter your idea");
    return;
  }

  try {

    setLoading(true);

    // ⭐ use consistent token key
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You are not logged in");
      navigate("/");
      return;
    }

    const response = await axios.post(
      "http://127.0.0.1:8000/api/myapp/extract/",
      {
        prompt: projectData.idea
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("API Response:", response.data);

    const apiResponse = response.data;
    const apiData = apiResponse.data;

    // ⭐ IMPORTANT — Save techstack id for later pages
    localStorage.setItem("techstack_id", apiResponse.id);
    console.log("Saved techstack_id:", apiResponse.id);

    const updatedProject = {
      ...projectData,

      techstack_id: apiResponse.id,

      // extracted stack
      languages: apiData.languages || [],
      frameworks: apiData.frameworks || [],
      databases: apiData.databases || [],
      cloud: apiData.cloud || [],

      // helper values used later in UI
      frontend: apiData.frameworks?.[0] || "React",
      backend: apiData.languages?.[0] || "Python",
      database: apiData.databases?.[0] || "PostgreSQL",
      auth: "JWT Auth",
      storage: apiData.cloud?.[0] || "AWS"
    };

    console.log("Saved Project Data:", updatedProject);

    setProjectData(updatedProject);

    navigate("/stack");

  } catch (error) {

    console.error("API Error:", error.response?.data || error);

    if (error.response?.status === 401) {
      alert("Session expired. Please login again.");
      navigate("/");
    } else {
      alert("Failed to process idea");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4">

      <FloatingLogo />

      <div className="flex w-full max-w-4xl items-center justify-between pt-2">

        <Stepper currentStep={1} />

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:border-indigo-400 hover:text-indigo-100"
        >
          Home
        </button>

      </div>

      <div className="mt-8 grid w-full max-w-4xl gap-6 lg:grid-cols-[1.6fr_1.1fr]">

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <h2 className="text-lg font-semibold text-white">
            What’s your idea?
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Describe your project in simple words.
          </p>

          <textarea
            value={projectData.idea || ""}
            onChange={(e) =>
              setProjectData({ ...projectData, idea: e.target.value })
            }
            placeholder="Example: A simple task manager for students."
            className="mt-4 h-32 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-indigo-400"
          />

          <p className="mt-4 text-xs text-slate-400">
            Or start from a template:
          </p>

          <div className="mt-2 flex flex-wrap gap-2">

            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() =>
                  setProjectData({ ...projectData, idea: ex })
                }
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-white hover:border-indigo-400"
              >
                {ex}
              </button>
            ))}

          </div>

          <button
            onClick={handleContinue}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm text-white"
          >
            {loading ? "Processing..." : "Continue to stack →"}
          </button>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">

          <h3 className="text-sm font-semibold text-white">
            Tips for a clear idea
          </h3>

          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs">
            <li>Explain what your app does.</li>
            <li>Mention who will use it.</li>
            <li>Add 2–3 main features.</li>
            <li>No need for tech terms.</li>
          </ul>

        </div>

      </div>

    </div>
  );
}