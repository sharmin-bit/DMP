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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center pt-20">

      <FloatingLogo />

      {/* Progress */}
      <Stepper currentStep={4} />

      {/* Card */}
      <div className="bg-white mt-10 p-10 rounded-2xl shadow-xl border w-[650px]">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Recommended Cloud Services
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Based on your stack and answers
        </p>

        <div className="mt-8 space-y-4">

          {services.map((service, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border rounded-lg"
            >

              <span className="text-gray-600">
                {service.name}
              </span>

              <span className="font-semibold text-indigo-600">
                {service.value}
              </span>

            </div>
          ))}

        </div>

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => navigate("/wizard")}
            className="flex-1 py-3 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/plan")}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Continue →
          </button>

        </div>

      </div>

    </div>
  );
}