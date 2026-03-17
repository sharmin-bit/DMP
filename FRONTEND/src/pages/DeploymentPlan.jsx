import { useNavigate } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";
import Stepper from "../components/Stepper";
export default function DeploymentPlan() {
  const navigate = useNavigate();

  const steps = [
    "Install dependencies",
    "Configure environment variables",
    "Deploy frontend to Netlify",
    "Deploy backend to Render",
    "Connect MongoDB Atlas database"
  ];

  const envVars = [
    "PORT=5000",
    "DB_URL=your_database_url",
    "JWT_SECRET=your_secret_key"
  ];

  const downloadPlan = async () => {
  try {
    const techstackId = localStorage.getItem("techstack_id"); // saved earlier
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      "http://127.0.0.1:8000/api/myapp/download-plan/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          techstack_id: techstackId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.log("Backend error:", error);
      throw new Error("Failed to download PDF");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "deployment_plan.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(error);
    alert("Error downloading deployment plan");
  }
};
  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4">
      <FloatingLogo />

      {/* Progress + top actions */}
      <div className="flex w-full max-w-4xl items-center justify-between pt-2">
        <Stepper currentStep={5} />
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm shadow-slate-900/80 transition hover:border-indigo-400 hover:text-indigo-100"
        >
          Home
        </button>
      </div>

      {/* Main Card */}
      <div className="mt-8 grid w-full max-w-4xl gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
          <h2 className="text-lg font-semibold text-center text-slate-50">
            Deployment plan
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Follow these steps to get your project live on the internet.
          </p>

          {/* Steps */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-200">
              Deployment steps
            </h3>

            <ul className="mt-3 space-y-2 text-sm">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 rounded-xl border border-slate-800/80 bg-slate-950/80 px-3 py-2.5 text-slate-200"
                >
                  <span className="mt-[2px] flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/90 text-[0.65rem] text-slate-300">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          {/* CLI Commands */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-5 text-sm text-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <h3 className="text-sm font-semibold text-slate-50">
              CLI commands
            </h3>
            <p className="mt-1 text-[0.75rem] text-slate-400">
              Run these in your terminal from the project folder.
            </p>

            <div className="mt-3 rounded-xl bg-slate-900 text-[0.8rem] text-emerald-300">
              <div className="border-b border-slate-800/80 px-3 py-2 text-[0.7rem] text-slate-400">
                bash
              </div>
              <div className="px-3 py-3 font-mono">
                npm install<br />
                npm run build<br />
                npm start
              </div>
            </div>
          </div>

          {/* Env variables */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-5 text-sm text-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <h3 className="text-sm font-semibold text-slate-50">
              Environment variables
            </h3>
            <p className="mt-1 text-[0.75rem] text-slate-400">
              Add these to your `.env` files (never commit real secrets).
            </p>

            <div className="mt-3 rounded-xl bg-slate-900/80 px-3 py-3">
              {envVars.map((env, index) => (
                <p key={index} className="font-mono text-[0.8rem] text-slate-100">
                  {env}
                </p>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
    onClick={downloadPlan}
    className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-green-700"
  >
    Download Plan PDF
  </button>
            <button
              onClick={() => navigate("/cloud")}
              className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 text-xs font-medium text-slate-200 shadow-sm shadow-slate-900/80 transition hover:border-indigo-400 hover:bg-slate-900 hover:text-indigo-100"
            >
              Back to cloud
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-fuchsia-500 px-4 py-2.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110 hover:shadow-[0_22px_70px_rgba(79,70,229,0.7)]"
            >
              <span>Save project &amp; finish</span>
              <span className="text-[0.7rem]">✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}