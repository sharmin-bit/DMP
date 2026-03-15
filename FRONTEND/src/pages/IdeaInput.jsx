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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center pt-20">

      <FloatingLogo />

      {/* Step Progress */}
      <Stepper currentStep={1} />


      {/* Main Card */}
      <div className="bg-white mt-10 p-10 rounded-2xl shadow-xl border w-[650px]">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          What's your idea?
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Describe your project in simple words
        </p>

        {/* Textarea */}
        <textarea
            value={projectData.idea}
            onChange={(e) =>
                setProjectData({ ...projectData, idea: e.target.value })
            }
            placeholder="Describe your project idea..."
            className="w-full mt-6 p-4 border rounded-lg h-28"
        />

        {/* Example Buttons */}
        <p className="text-sm text-gray-500 mt-5">
          Or try one of these:
        </p>

        <div className="flex flex-wrap gap-3 mt-3">

          {examples.map((ex, i) => (
  <button
    key={i}
    onClick={() =>
      setProjectData({ ...projectData, idea: ex })
    }
    className="px-4 py-2 border rounded-full text-sm hover:bg-gray-100"
  >
    {ex}
  </button>
))}

        </div>

        {/* Continue */}
        <button
        onClick={() => navigate("/stack")}
        className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
            Continue →
        </button>

      </div>


      {/* Tips Card */}
      <div className="bg-white mt-8 p-6 rounded-xl shadow border w-[650px]">

        <h3 className="font-semibold mb-2">
          💡 Tips for a great project description
        </h3>

        <ul className="text-gray-600 text-sm list-disc ml-5">

          <li>Explain what your app does</li>
          <li>Mention your target users</li>
          <li>Add main features if possible</li>
          <li>Don't worry about technical details</li>

        </ul>

      </div>

    </div>
  );
}