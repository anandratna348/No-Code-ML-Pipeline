import { Check, Database, Settings, Split, Brain, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { number: 1, title: 'Upload', icon: <Database className="w-4 h-4" /> },
  { number: 2, title: 'Preprocess', icon: <Settings className="w-4 h-4" /> },
  { number: 3, title: 'Split', icon: <Split className="w-4 h-4" /> },
  { number: 4, title: 'Model', icon: <Brain className="w-4 h-4" /> },
  { number: 5, title: 'Results', icon: <BarChart3 className="w-4 h-4" /> },
];

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isActive = currentStep === step.number;
          const isClickable = isCompleted || step.number <= Math.max(...completedSteps, 1) + 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <button
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all duration-300",
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
              >
                <div
                  className={cn(
                    "step-indicator",
                    isActive && "active",
                    isCompleted && !isActive && "completed",
                    !isActive && !isCompleted && "pending"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </button>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300",
                    completedSteps.includes(step.number) ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
