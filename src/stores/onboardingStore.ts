import { create } from 'zustand';
import type {
  OnboardingFormData,
  BasicInfoData,
  PANDetailsData,
  GSTInfoData,
  BankAccountData,
  MSMEStatusData,
  DrugLicenseData,
  ContactInformationData,
  CommercialDetailsData,
  SupplierApiData,
} from '@/types/onboarding';
import { INITIAL_FORM_DATA } from '@/types/onboarding';
import { getSupplier, submitOnboardingData } from '@/services/erpnextApi';

interface OnboardingStore {
  currentStep: number;
  formData: OnboardingFormData;
  isSubmitted: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  supplierId: string | null;
  supplierData: SupplierApiData | null;
  
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
  updateDrugLicense: (data: Partial<DrugLicenseData>) => void;
  updateContactInformation: (data: Partial<ContactInformationData>) => void;
  updateCommercialDetails: (data: Partial<CommercialDetailsData>) => void;
  setTermsAccepted: (accepted: boolean) => void;
  
  // API Actions
  initializeFromUrl: () => Promise<void>;
  submitForm: () => Promise<{ success: boolean; message: string }>;
  resetForm: () => void;
  setError: (error: string | null) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentStep: 1,
  formData: INITIAL_FORM_DATA,
  isSubmitted: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
  supplierId: null,
  supplierData: null,

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, 9),
  })),

  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1),
  })),

  goToStep: (step: number) => set({
    currentStep: Math.min(Math.max(step, 1), 9),
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

  updateDrugLicense: (data) => set((state) => ({
    formData: {
      ...state.formData,
      drugLicense: { ...state.formData.drugLicense, ...data },
    },
  })),

  updateContactInformation: (data) => set((state) => ({
    formData: {
      ...state.formData,
      contactInformation: { ...state.formData.contactInformation, ...data },
    },
  })),

  updateCommercialDetails: (data) => set((state) => ({
    formData: {
      ...state.formData,
      commercialDetails: { ...state.formData.commercialDetails, ...data },
    },
  })),

  setTermsAccepted: (accepted) => set((state) => ({
    formData: { ...state.formData, termsAccepted: accepted },
  })),

  setError: (error) => set({ error }),

  initializeFromUrl: async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const supplierId = urlParams.get('supplier');

    if (!supplierId) {
      set({ error: 'No supplier ID provided. Please use the link sent to your email.' });
      return;
    }

    set({ isLoading: true, error: null, supplierId });

    try {
      const supplierData = await getSupplier(supplierId);
      
      // Pre-fill form with existing supplier data
      const gstStatus: 'registered' | 'not_registered' | '' = 
        supplierData.gst_category === 'Registered Regular' || 
        supplierData.gst_category === 'Registered Composition' 
          ? 'registered' 
          : supplierData.gst_category === 'Unregistered' 
            ? 'not_registered' 
            : '';

      set((state) => ({
        supplierData,
        formData: {
          ...state.formData,
          basicInfo: {
            ...state.formData.basicInfo,
            company_name: supplierData.supplier_name || '',
            email: supplierData.email_id || '',
            phone: supplierData.mobile_no || '',
          },
          panDetails: {
            pan_number: supplierData.pan || '',
          },
          gstInfo: {
            gst_status: gstStatus,
            gst_number: supplierData.gstin || '',
          },
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load supplier data',
      });
    }
  },

  submitForm: async () => {
    const { supplierId, formData } = get();

    if (!supplierId) {
      return { success: false, message: 'No supplier ID found' };
    }

    set({ isSubmitting: true, error: null });

    try {
      const result = await submitOnboardingData(supplierId, {
        basicInfo: formData.basicInfo,
        panDetails: formData.panDetails,
        gstInfo: formData.gstInfo,
        bankAccount: formData.bankAccount,
        drugLicense: formData.drugLicense,
        contactInformation: formData.contactInformation,
        commercialDetails: formData.commercialDetails,
      });

      if (result.success) {
        set({ isSubmitted: true, isSubmitting: false });
      } else {
        set({ error: result.message, isSubmitting: false });
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      set({ error: message, isSubmitting: false });
      return { success: false, message };
    }
  },

  resetForm: () => set({
    currentStep: 1,
    formData: INITIAL_FORM_DATA,
    isSubmitted: false,
    isSubmitting: false,
    error: null,
  }),
}));
