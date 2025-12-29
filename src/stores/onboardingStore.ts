import { create } from 'zustand';
import type {
  OnboardingFormData,
  BasicInfoData,
  PANDetailsData,
  GSTInfoData,
  BankAccountData,
  MSMEStatusData,
} from '@/types/onboarding';
import { INITIAL_FORM_DATA } from '@/types/onboarding';

interface OnboardingStore {
  currentStep: number;
  formData: OnboardingFormData;
  isSubmitted: boolean;
  
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Data updates
  updateBasicInfo: (data: Partial<BasicInfoData>) => void;
  updatePANDetails: (data: Partial<PANDetailsData>) => void;
  updateGSTInfo: (data: Partial<GSTInfoData>) => void;
  updateBankAccount: (data: Partial<BankAccountData>) => void;
  updateMSMEStatus: (data: Partial<MSMEStatusData>) => void;
  setTermsAccepted: (accepted: boolean) => void;
  
  // Actions
  submitForm: () => void;
  resetForm: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 1,
  formData: INITIAL_FORM_DATA,
  isSubmitted: false,

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, 6),
  })),

  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1),
  })),

  goToStep: (step: number) => set({
    currentStep: Math.min(Math.max(step, 1), 6),
  }),

  updateBasicInfo: (data) => set((state) => ({
    formData: {
      ...state.formData,
      basicInfo: { ...state.formData.basicInfo, ...data },
    },
  })),

  updatePANDetails: (data) => set((state) => ({
    formData: {
      ...state.formData,
      panDetails: { ...state.formData.panDetails, ...data },
    },
  })),

  updateGSTInfo: (data) => set((state) => ({
    formData: {
      ...state.formData,
      gstInfo: { ...state.formData.gstInfo, ...data },
    },
  })),

  updateBankAccount: (data) => set((state) => ({
    formData: {
      ...state.formData,
      bankAccount: { ...state.formData.bankAccount, ...data },
    },
  })),

  updateMSMEStatus: (data) => set((state) => ({
    formData: {
      ...state.formData,
      msmeStatus: { ...state.formData.msmeStatus, ...data },
    },
  })),

  setTermsAccepted: (accepted) => set((state) => ({
    formData: { ...state.formData, termsAccepted: accepted },
  })),

  submitForm: () => set({ isSubmitted: true }),

  resetForm: () => set({
    currentStep: 1,
    formData: INITIAL_FORM_DATA,
    isSubmitted: false,
  }),
}));

