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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center pt-20">

      <FloatingLogo />

      {/* Progress */}
      <Stepper currentStep={5} />

      {/* Main Card */}
      <div className="bg-white mt-10 p-10 rounded-2xl shadow-xl border w-[700px]">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Deployment Plan
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Follow these steps to deploy your project
        </p>

        {/* Steps */}
        <div className="mt-8">

          <h3 className="font-semibold mb-3">
            Deployment Steps
          </h3>

          <ul className="space-y-2">

            {steps.map((step, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg"
              >
                {index + 1}. {step}
              </li>
            ))}

          </ul>

        </div>

        {/* CLI Commands */}
        <div className="mt-8">

          <h3 className="font-semibold mb-3">
            CLI Commands
          </h3>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">

            npm install<br/>
            npm run build<br/>
            npm start

          </div>

        </div>

        {/* Env variables */}
        <div className="mt-8">

          <h3 className="font-semibold mb-3">
            Environment Variables
          </h3>

          <div className="bg-gray-100 p-4 rounded-lg">

            {envVars.map((env, index) => (
              <p key={index} className="font-mono text-sm">
                {env}
              </p>
            ))}

          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={() => navigate("/cloud")}
            className="flex-1 py-3 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Project →
          </button>

        </div>

      </div>

    </div>
  );
}