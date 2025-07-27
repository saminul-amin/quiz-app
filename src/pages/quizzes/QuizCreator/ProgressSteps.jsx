import { BookOpen, Target, Settings } from "lucide-react";

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Basic Info", icon: BookOpen },
    { id: 2, name: "Questions", icon: Target },
    { id: 3, name: "Settings", icon: Settings },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              currentStep === step.id
                ? "bg-blue-500 text-white shadow-lg"
                : currentStep > step.id
                ? "bg-emerald-500 text-white"
                : "bg-white text-slate-600 shadow-md"
            }`}
          >
            <step.icon size={18} />
            <span className="font-medium">{step.name}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 mx-4 transition-colors duration-300 ${
                currentStep > step.id ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
