import { useEffect } from 'react';
import { Loader2, AlertCircle, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { message } from 'antd';
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
import { SelfDeclarationStep, validateSelfDeclaration } from './steps/SelfDeclarationStep';
import { ReviewSubmitStep, validateReviewSubmit } from './steps/ReviewSubmitStep';
import { ThankYouPage } from './ThankYouPage';
import { useOnboardingStore } from '@/stores/onboardingStore';
// import { generateSamplePDF } from '@/utils/generateSamplePDF';

export function OnboardingPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    currentStep,
    formData,
    submitForm,
    initializeFromUrl,
    isLoading,
    isSubmitting,
    isSubmitted,
    error,
    supplierId,
    supplierData,
    linkStatus,
  } = useOnboardingStore();

  // Initialize from URL params on mount
  useEffect(() => {
    initializeFromUrl();
  }, [initializeFromUrl]);

  // Auto-download sample PDF on page load
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     generateSamplePDF().catch((error) => {
  //       console.error('Sample PDF generation failed:', error);
  //     });
  //   }, 2000); // Wait 2 seconds after page load

  //   return () => clearTimeout(timer);
  // }, []);


  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateBasicInfo(formData.basicInfo);
      case 2:
        return validateContactInformation(formData.contactInformation);
      case 3:
        return validatePANDetails(formData.panDetails, supplierData?.custom_pan_img);
      case 4:
        return validateGSTInfo(formData.gstInfo, supplierData?.custom_gst_img);
      case 5:
        return validateBankAccount(formData.bankAccount);
      case 6:
        return validateMSMEStatus(formData.msmeStatus);
      case 7:
        return validateDrugLicense(formData.drugLicense);
      case 8:
        return validateCommercialDetails(formData.commercialDetails, supplierData?.custom_authorized_distributors);
      case 9:
        return validateSelfDeclaration(formData.selfDeclaration, formData.signatureData, formData.signaturePlace);
      case 10:
        return validateReviewSubmit(formData.termsAccepted);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (validateReviewSubmit(formData.termsAccepted)) {
      const result = await submitForm();
      if (result.success) {
        // Form submission successful - ThankYouPage will be shown
        messageApi.success({
          content: 'Form submitted successfully!',
          duration: 3,
        });
      } else {
        messageApi.error({
          content: result.message || 'Failed to submit. Please try again.',
          duration: 5,
        });
      }
    }
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
        return <SelfDeclarationStep />;
      case 10:
        return <ReviewSubmitStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  // Show Thank You page if form is submitted
  if (isSubmitted) {
    return <ThankYouPage />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-center">
              Loading your onboarding form....
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Link expired (server-side 24hr check)
  if (linkStatus === 'expired') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 px-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Clock className="w-16 h-16 text-amber-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">This link has expired</h1>
                <p className="text-lg text-muted-foreground">
                  For security, onboarding links are valid for 24 hours.
                </p>
              </div>
              <div className="flex flex-col gap-3 max-w-md">
                <p className="text-muted-foreground">
                  Please contact the Geri Care Purchase Team to get a new link.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t w-full">
                <p className="text-sm text-muted-foreground">
                  Email:{' '}
                  <a href="mailto:purchasemanager@gericare.in" className="text-primary underline font-medium">purchasemanager@gericare.in</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already completed
  if (linkStatus === 'completed') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 px-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-16 h-16 text-blue-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Already Submitted</h1>
                <p className="text-lg text-muted-foreground">
                  Your vendor onboarding application has already been submitted
                </p>
              </div>
              <div className="flex flex-col gap-3 max-w-md">
                <p className="text-muted-foreground">
                  Your documents have been submitted and are being reviewed by our team. No further action is required from your end.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t w-full">
                <p className="text-sm text-muted-foreground">
                  If you have any questions, please contact Geri Care Purchase team -{' '}
                  <a href="mailto:purchasemanager@gericare.in" className="text-primary underline font-medium">purchasemanager@gericare.in</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid link
  if (linkStatus === 'invalid' || (error && !supplierId)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 px-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-16 h-16 text-red-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Invalid Link</h1>
                <p className="text-lg text-muted-foreground">
                  This link is not valid
                </p>
              </div>
              <div className="flex flex-col gap-3 max-w-md">
                <p className="text-muted-foreground">
                  Please use the latest link from your email. If you continue to face issues, contact the Geri Care Purchase Team.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t w-full">
                <p className="text-sm text-muted-foreground">
                  Email:{' '}
                  <a href="mailto:purchasemanager@gericare.in" className="text-primary underline font-medium">purchasemanager@gericare.in</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generic error
  if (linkStatus === 'error' || error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 px-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
                <p className="text-lg text-muted-foreground">
                  Please try again later
                </p>
              </div>
              <div className="mt-6 pt-6 border-t w-full">
                <p className="text-sm text-muted-foreground">
                  If the issue persists, contact Geri Care Purchase team -{' '}
                  <a href="mailto:purchasemanager@gericare.in" className="text-primary underline font-medium">purchasemanager@gericare.in</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Vendor Onboarding</h1>
            <img
              src="/Geri_Care_Logo_nEw.jpg"
              alt="Geri Care"
              className="h-16 object-contain"
            />
            <div className="w-[140px]" />
          </div>
        </header>

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
      </div>
    </>
  );
}
