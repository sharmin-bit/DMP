import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FloatingLogo from "../components/FloatingLogo";
import Stepper from "../components/Stepper";
import { ProjectContext } from "../context/ProjectContext";

export default function Wizard() {

  const navigate = useNavigate();
  const { projectData, setProjectData } = useContext(ProjectContext);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

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

  const current = questions[step];

  const handleAnswer = async (answer) => {

    const updatedAnswers = {
      ...(projectData.answers || {}),
      [current.key]: answer
    };

    setProjectData({
      ...projectData,
      answers: updatedAnswers
    });

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // FINAL QUESTION -> CALL DEPLOYMENT API
    try {

      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Login required");
        navigate("/");
        return;
      }

      if (!projectData.techstack_id) {
        alert("Tech stack not found. Please generate stack again.");
        navigate("/idea");
        return;
      }

      const answers = updatedAnswers;

      // Convert user range to numeric value
      let usersNumber = 1000;

      if (answers.users === "< 1k") usersNumber = 500;
      if (answers.users === "1k - 10k") usersNumber = 5000;
      if (answers.users === "10k - 100k") usersNumber = 50000;
      if (answers.users === "100k+") usersNumber = 150000;

      console.log("Token:", token);
      console.log("Techstack ID:", projectData.techstack_id);
      const payload = {
        techstack: projectData.techstack_id,
        coding_choice: answers.coding === "Coding" ? "coding" : "no-code",
        monthly_users: usersNumber,
        runtime: answers.runtime.toLowerCase(),
        media_upload: answers.media === "Yes",
        auth_required: answers.auth === "Yes"
      };

      console.log("Payload sent to backend:", payload);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/myapp/deployment/preferences/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Deployment API Response:", response.data);

      setProjectData({
        ...projectData,
        answers: updatedAnswers,
        deployment: response.data
      });

      navigate("/cloud");

    } catch (error) {

      console.error(
        "Deployment API Error:",
        error.response?.data || error
      );

      alert("Deployment API failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4">

      <FloatingLogo />

      <div className="flex w-full max-w-4xl items-center justify-between pt-2">

        <Stepper currentStep={3} />

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs text-white"
        >
          Home
        </button>

      </div>

      <div className="mt-8 w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-6">

        <h2 className="text-lg font-semibold text-white text-center">
          {current.question}
        </h2>

        <div className="mt-6 grid gap-3">

          {current.options.map((opt, i) => (

            <button
              key={i}
              disabled={loading}
              onClick={() => handleAnswer(opt)}
              className="flex justify-between rounded-xl border border-slate-800 px-4 py-3 text-white hover:border-indigo-400"
            >

              <span>{opt}</span>

              <span className="h-2 w-2 rounded-full bg-slate-600" />

            </button>

          ))}

        </div>

        <div className="mt-5 text-xs text-slate-400 text-center">
          Question {step + 1} of {questions.length}
        </div>

      </div>

    </div>
  );
}