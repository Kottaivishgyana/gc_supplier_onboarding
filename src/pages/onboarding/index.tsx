import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/onboarding/Stepper';
import { MobileStepper } from '@/components/ui/onboarding/MobileStepper';
import { StepNavigation } from '@/components/ui/onboarding/StepNavigation';
import { BasicInfoStep, validateBasicInfo } from './steps/BasicInfoStep';
import { PANDetailsStep, validatePANDetails } from './steps/PANDetailsStep';
import { GSTInfoStep, validateGSTInfo } from './steps/GSTInfoStep';
import { BankAccountStep, validateBankAccount } from './steps/BankAccountStep';
import { MSMEStatusStep, validateMSMEStatus } from './steps/MSMEStatusStep';
import { ReviewSubmitStep, validateReviewSubmit } from './steps/ReviewSubmitStep';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function OnboardingPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { currentStep, formData, submitForm, resetForm } = useOnboardingStore();

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateBasicInfo(formData.basicInfo);
      case 2:
        return validatePANDetails(formData.panDetails);
      case 3:
        return validateGSTInfo(formData.gstInfo);
      case 4:
        return validateBankAccount(formData.bankAccount);
      case 5:
        return validateMSMEStatus(formData.msmeStatus);
      case 6:
        return validateReviewSubmit(formData.termsAccepted);
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (validateReviewSubmit(formData.termsAccepted)) {
      submitForm();
      setShowSuccessModal(true);
      console.log('Form submitted:', formData);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <PANDetailsStep />;
      case 3:
        return <GSTInfoStep />;
      case 4:
        return <BankAccountStep />;
      case 5:
        return <MSMEStatusStep />;
      case 6:
        return <ReviewSubmitStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-7xl gap-8 lg:gap-16">
          {/* Sidebar Stepper */}
          <Stepper />

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            {/* Mobile Stepper */}
            <MobileStepper />

            {/* Step Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderStep()}
            </div>

            {/* Navigation */}
            <StepNavigation onNext={validateCurrentStep} onSubmit={handleSubmit} />
          </main>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <DialogTitle className="text-2xl text-center">Application Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your KYC application has been submitted successfully. Our team will
              review your documents and get back to you within 3-5 business days.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={handleCloseModal} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

