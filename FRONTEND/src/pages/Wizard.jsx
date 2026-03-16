import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";
import Stepper from "../components/Stepper";
import { ProjectContext } from "../context/ProjectContext";

export default function Wizard() {

  const navigate = useNavigate();
  const { projectData, setProjectData } = useContext(ProjectContext);

  const questions = [
    {
      key: "coding",
      question: "Do you prefer coding or no-code?",
      options: ["Coding", "No-Code"]
    },
    {
      key: "users",
      question: "Expected monthly users?",
      options: ["< 1k", "1k - 10k", "10k - 100k", "100k+"]
    },
    {
      key: "runtime",
      question: "Preferred runtime environment?",
      options: ["Serverless", "Container", "Static"]
    },
    {
      key: "media",
      question: "Will your app handle media uploads?",
      options: ["Yes", "No"]
    },
    {
      key: "auth",
      question: "Do you need authentication?",
      options: ["Yes", "No"]
    }
  ];

  const [step, setStep] = useState(0);
  const current = questions[step];

  const handleAnswer = (answer) => {

    setProjectData({
      ...projectData,
      answers: {
        ...projectData.answers,
        [current.key]: answer
      }
    });

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/cloud");
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4">
      <FloatingLogo />

      {/* Stepper */}
      <div className="flex w-full max-w-4xl items-center justify-between pt-2">
        <Stepper currentStep={3} />
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm shadow-slate-900/80 transition hover:border-indigo-400 hover:text-indigo-100"
        >
          Home
        </button>
      </div>

      <div className="mt-8 w-full max-w-3xl rounded-2xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
        <h2 className="text-lg font-semibold text-slate-50 text-center">
          {current.question}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          These answers help us pick sensible defaults for your cloud setup.
        </p>

        <div className="mt-6 grid gap-3">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900"
            >
              <span>{opt}</span>
              <span className="h-2 w-2 rounded-full bg-slate-600" />
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between text-[0.75rem] text-slate-400">
          <span>
            Question {step + 1} of {questions.length}
          </span>
          <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[0.7rem] text-slate-300">
            Click an option to go next
          </span>
        </div>
      </div>
    </div>
  );
}