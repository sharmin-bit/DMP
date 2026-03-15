export default function Stepper({ currentStep }) {

  const steps = ["Idea", "Stack", "Q&A", "Cloud", "Plan"];

  return (
    <div className="flex justify-center gap-8 mt-8 text-sm">

      {steps.map((step, index) => {

        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (

          <div key={index} className="flex items-center gap-2">

            {/* Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs
              ${isCompleted ? "bg-green-500" :
                isActive ? "bg-indigo-600" :
                "bg-gray-300"}`}
            >
              {stepNumber}
            </div>

            {/* Label */}
            <span
              className={`${isActive ? "text-indigo-600 font-semibold" : "text-gray-500"}`}
            >
              {step}
            </span>

          </div>

        );
      })}

    </div>
  );
}