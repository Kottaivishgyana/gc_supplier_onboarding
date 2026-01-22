import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { message } from 'antd';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stepper } from '@/components/ui/onboarding/Stepper';
import { MobileStepper } from '@/components/ui/onboarding/MobileStepper';
import { StepNavigation } from '@/components/ui/onboarding/StepNavigation';
import { BasicInfoStep, validateBasicInfo } from './steps/BasicInfoStep';
import { PANDetailsStep, validatePANDetails } from './steps/PANDetailsStep';
import { GSTInfoStep, validateGSTInfo } from './steps/GSTInfoStep';
import { BankAccountStep, validateBankAccount } from './steps/BankAccountStep';
import { MSMEStatusStep, validateMSMEStatus } from './steps/MSMEStatusStep';
import { DrugLicenseStep, validateDrugLicense } from './steps/DrugLicenseStep';
import { ContactInformationStep, validateContactInformation } from './steps/ContactInformationStep';
import { CommercialDetailsStep, validateCommercialDetails } from './steps/CommercialDetailsStep';
import { ReviewSubmitStep, validateReviewSubmit } from './steps/ReviewSubmitStep';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function OnboardingPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { 
    currentStep, 
    formData, 
    submitForm, 
    resetForm,
    initializeFromUrl,
    isLoading,
    isSubmitting,
    error,
    supplierId,
    panVerificationStatus,
    gstVerificationStatus,
    bankVerificationStatus,
    msmeVerificationStatus,
  } = useOnboardingStore();

  // Initialize from URL params on mount
  useEffect(() => {
    initializeFromUrl();
  }, [initializeFromUrl]);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateBasicInfo(formData.basicInfo);
      case 2:
        return validateContactInformation(formData.contactInformation);
      case 3:
        return validatePANDetails(formData.panDetails);
      case 4:
        return validateGSTInfo(formData.gstInfo);
      case 5:
        return validateBankAccount(formData.bankAccount);
      case 6:
        return validateMSMEStatus(formData.msmeStatus);
      case 7:
        return validateDrugLicense(formData.drugLicense);
      case 8:
        return validateCommercialDetails(formData.commercialDetails);
      case 9:
        return validateReviewSubmit(formData.termsAccepted);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    // Check PAN verification status
    if (panVerificationStatus === 'error') {
      messageApi.error({
        content: 'PAN verification failed. Please verify your PAN details before submitting the form.',
        duration: 5,
      });
      // Navigate to PAN details step
      useOnboardingStore.getState().goToStep(3);
      return;
    }
    
    if (panVerificationStatus === null || panVerificationStatus === 'pending') {
      messageApi.warning({
        content: 'Please wait for PAN verification to complete before submitting the form.',
        duration: 5,
      });
      // Navigate to PAN details step
      useOnboardingStore.getState().goToStep(3);
      return;
    }

    // Check GST verification status (only if GST status is registered)
    if (formData.gstInfo.gst_status === 'registered') {
      if (gstVerificationStatus === 'error') {
        messageApi.error({
          content: 'GST verification failed. Please verify your GST details before submitting the form.',
          duration: 5,
        });
        // Navigate to GST info step
        useOnboardingStore.getState().goToStep(4);
        return;
      }
      
      if (gstVerificationStatus === null || gstVerificationStatus === 'pending') {
        messageApi.warning({
          content: 'Please wait for GST verification to complete before submitting the form.',
          duration: 5,
        });
        // Navigate to GST info step
        useOnboardingStore.getState().goToStep(4);
        return;
      }
    }

    // Check Bank Account verification status
    if (bankVerificationStatus === 'error') {
      messageApi.error({
        content: 'Bank account verification failed. Please verify your bank account details before submitting the form.',
        duration: 5,
      });
      // Navigate to bank account step
      useOnboardingStore.getState().goToStep(5);
      return;
    }
    
    if (bankVerificationStatus === null || bankVerificationStatus === 'pending') {
      messageApi.warning({
        content: 'Please wait for bank account verification to complete before submitting the form.',
        duration: 5,
      });
      // Navigate to bank account step
      useOnboardingStore.getState().goToStep(5);
      return;
    }

    // Check MSME verification status (only if MSME status is yes)
    if (formData.msmeStatus.msme_status === 'yes') {
      if (msmeVerificationStatus === 'error') {
        messageApi.error({
          content: 'MSME verification failed. Please verify your MSME details before submitting the form.',
          duration: 5,
        });
        // Navigate to MSME status step
        useOnboardingStore.getState().goToStep(6);
        return;
      }
      
      if (msmeVerificationStatus === null || msmeVerificationStatus === 'pending') {
        messageApi.warning({
          content: 'Please wait for MSME verification to complete before submitting the form.',
          duration: 5,
        });
        // Navigate to MSME status step
        useOnboardingStore.getState().goToStep(6);
        return;
      }
    }

    if (validateReviewSubmit(formData.termsAccepted)) {
      const result = await submitForm();
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        messageApi.error({
          content: result.message || 'Failed to submit. Please try again.',
          duration: 5,
        });
      }
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    resetForm();
    // Redirect to a thank you page or close window
    window.close();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <ContactInformationStep />;
      case 3:
        return <PANDetailsStep />;
      case 4:
        return <GSTInfoStep />;
      case 5:
        return <BankAccountStep />;
      case 6:
        return <MSMEStatusStep />;
      case 7:
        return <DrugLicenseStep />;
      case 8:
        return <CommercialDetailsStep />;
      case 9:
        return <ReviewSubmitStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-center">
              Loading your onboarding form...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state (no supplier ID or API error)
  if (error && !supplierId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-center">Invalid Link</h2>
            <p className="text-muted-foreground text-center">
              {error}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Please contact your administrator or use the link sent to your email.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-7xl gap-8 lg:gap-16">
          {/* Sidebar Stepper */}
          <Stepper />

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            {/* Mobile Stepper */}
            <MobileStepper />

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderStep()}
            </div>

            {/* Navigation */}
            <StepNavigation 
              onNext={validateCurrentStep} 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
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
              Your onboarding application has been submitted successfully. Our team will
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
    </>
  );
}
