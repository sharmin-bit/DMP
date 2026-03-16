import { useNavigate } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";
import Stepper from "../components/Stepper";
export default function Cloud() {

  const navigate = useNavigate();

  const services = [
    { name: "Frontend Hosting", value: "Netlify" },
    { name: "Backend Hosting", value: "Render" },
    { name: "Database", value: "MongoDB Atlas" },
    { name: "Authentication", value: "Firebase Auth" },
    { name: "File Storage", value: "Cloudinary" }
  ];

  return (
    <div className="app-shell flex min-h-screen flex-col items-center px-4">
      <FloatingLogo />

      {/* Progress + top actions */}
      <div className="flex w-full max-w-4xl items-center justify-between pt-2">
        <Stepper currentStep={4} />
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm shadow-slate-900/80 transition hover:border-indigo-400 hover:text-indigo-100"
        >
          Home
        </button>
      </div>

      {/* Card */}
      <div className="mt-8 w-full max-w-3xl rounded-2xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.9)]">
        <h2 className="text-lg font-semibold text-slate-50 text-center">
          Recommended cloud services
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Based on your stack and answers, these are beginner-friendly options.
        </p>

        <div className="mt-6 space-y-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm"
            >
              <span className="text-slate-300">{service.name}</span>
              <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-indigo-200 ring-1 ring-inset ring-indigo-500/50">
                {service.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/wizard")}
            className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 text-xs font-medium text-slate-200 shadow-sm shadow-slate-900/80 transition hover:border-indigo-400 hover:bg-slate-900 hover:text-indigo-100"
          >
            Back to Q&amp;A
          </button>

          <button
            onClick={() => navigate("/plan")}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-fuchsia-500 px-4 py-2.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110 hover:shadow-[0_22px_70px_rgba(79,70,229,0.7)]"
          >
            <span>Continue to plan</span>
            <span className="text-[0.7rem]">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}