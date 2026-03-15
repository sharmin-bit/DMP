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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center pt-20">

      <FloatingLogo />

      <Stepper currentStep={3} />

      <div className="bg-white mt-10 p-10 rounded-2xl shadow-xl border w-[650px]">

        <h2 className="text-xl font-semibold text-center text-gray-800">
          {current.question}
        </h2>

        <div className="mt-8 flex flex-col gap-4">

          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="p-4 border rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition"
            >
              {opt}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}