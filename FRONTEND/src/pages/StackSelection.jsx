import { useNavigate } from "react-router-dom";
import FloatingLogo from "../components/FloatingLogo";
import Stepper from "../components/Stepper";

export default function StackSelection() {
    const navigate = useNavigate();
  const stack = [
    { name: "Frontend", value: "React" },
    { name: "Backend", value: "Django" },
    { name: "Database", value: "PostgreSQL" },
    { name: "Authentication", value: "Firebase Auth" },
    { name: "Storage", value: "Cloudinary" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center pt-20">

      <FloatingLogo />

      {/* Progress */}
      <Stepper currentStep={2} />

      {/* Card */}
      <div className="bg-white mt-10 p-10 rounded-2xl shadow-xl border w-[650px]">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Suggested Tech Stack
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Based on your idea, here is a recommended stack
        </p>

        {/* Stack List */}
        <div className="mt-8 space-y-4">

          {stack.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border rounded-lg"
            >

              <span className="text-gray-600">
                {item.name}
              </span>

              <span className="font-semibold text-indigo-600">
                {item.value}
              </span>

            </div>
          ))}

        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={() => navigate("/idea")}
            className="flex-1 py-3 border rounded-lg hover:bg-gray-100"
            >
            Change Stack
            </button>

          <button
            onClick={() => navigate("/wizard")}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
            Use Stack →
            </button>

        </div>

      </div>

    </div>
  );
}