import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';

interface StepNavigationProps {
  onNext: () => boolean;
  onSubmit?: () => void;
}

export function StepNavigation({ onNext, onSubmit }: StepNavigationProps) {
  const { currentStep, nextStep, prevStep } = useOnboardingStore();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 6;

  const handleNext = () => {
    if (onNext()) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (onNext() && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
      {!isFirstStep ? (
        <Button
          variant="secondary"
          onClick={handlePrev}
          className="w-full sm:w-auto gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
      ) : (
        <div />
      )}
      
      <div className="flex-1" />

      {!isLastStep ? (
        <Button
          onClick={handleNext}
          className="w-full sm:w-auto gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
        >
          Save & Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          onClick={handleSubmit}
          className="w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700 shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30"
        >
          <CheckCircle className="w-4 h-4" />
          Submit Application
        </Button>
      )}
    </div>
  );
}

