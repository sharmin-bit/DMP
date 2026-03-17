import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import FloatingLogo from "../components/FloatingLogo";
import Stepper from "../components/Stepper";
import { ProjectContext } from "../context/ProjectContext";
import { useToast } from "../components/ToastProvider.jsx";

export default function StackSelection() {

  const navigate = useNavigate();
  const { projectData } = useContext(ProjectContext);
  const toast = useToast();

  console.log("StackSelection ProjectData:", projectData);

  const stack = [
    {
      name: "Languages",
      value: projectData?.languages?.length
        ? projectData.languages.join(", ")
        : "Not detected"
    },
    {
      name: "Frameworks",
      value: projectData?.frameworks?.length
        ? projectData.frameworks.join(", ")
        : "Not detected"
    },
    {
      name: "Database",
      value: projectData?.databases?.length
        ? projectData.databases.join(", ")
        : "Not detected"
    },
    {
      name: "Cloud",
      value: projectData?.cloud?.length
        ? projectData.cloud.join(", ")
        : "Not detected"
    },
    {
      name: "Authentication",
      value: projectData?.auth || "JWT Auth"
    }
  ];

  const handleContinue = () => {

    // Ensure techstack id exists before moving forward
    if (!projectData?.techstack_id) {
      toast.push({
        tone: "warning",
        title: "Missing tech stack",
        message: "Please enter your idea again to generate a stack.",
      });
      navigate("/idea");
      return;
    }

    navigate("/wizard");
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4">

      <FloatingLogo />

      <div className="flex w-full max-w-4xl items-center justify-between pt-2">

        <Stepper currentStep={2} />

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-white hover:border-indigo-400"
        >
          Home
        </button>

      </div>

      <div className="mt-8 w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6">

        <h2 className="text-lg font-semibold text-center text-white">
          Suggested Tech Stack
        </h2>

        <p className="mt-1 text-center text-xs text-slate-400">
          Based on your idea, here is a recommended stack.
        </p>

        <div className="mt-6 space-y-3">

          {stack.map((item, index) => (

            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3 text-sm"
            >

              <span className="text-slate-300">
                {item.name}
              </span>

              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-indigo-200">
                {item.value}
              </span>

            </div>

          ))}

        </div>

        <div className="mt-6 flex gap-4">

          <button
            onClick={() => navigate("/idea")}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 py-2 text-xs text-white hover:border-indigo-400"
          >
            Back to Idea
          </button>

          <button
            onClick={handleContinue}
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-2 text-xs text-white"
          >
            Continue to Q&A →
          </button>

        </div>

      </div>

    </div>
  );
}