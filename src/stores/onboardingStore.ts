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

// LocalStorage key for caching
const STORAGE_KEY = 'vendor-onboarding-cache';

// Helper to serialize form data (excluding File objects)
function serializeFormData(formData: OnboardingFormData): Partial<OnboardingFormData> {
  return {
    ...formData,
    panDetails: {
      ...formData.panDetails,
      pan_document: null, // Files can't be serialized
    },
    gstInfo: {
      ...formData.gstInfo,
      gst_document: null, // Files can't be serialized
    },
    drugLicense: {
      ...formData.drugLicense,
      drug_license_document: null, // Files can't be serialized
    },
    msmeStatus: {
      ...formData.msmeStatus,
      msme_document: null, // Files can't be serialized
    },
    commercialDetails: {
      ...formData.commercialDetails,
      authorized_distributors: formData.commercialDetails.authorized_distributors?.map(item => ({
        ...item,
        document: null, // Files can't be serialized
      })),
    },
  };
}

// Helper to migrate old cached data format to new format
function migrateCachedData(data: Partial<OnboardingFormData> | null): Partial<OnboardingFormData> | null {
  if (!data) return data;
  
  // Migrate invoice_discount_type from old format to new format
  if (data.commercialDetails?.invoice_discount_type) {
    const oldValue = data.commercialDetails.invoice_discount_type as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commercialDetails = data.commercialDetails as any;
    if (oldValue === 'on_invoice') {
      commercialDetails.invoice_discount_type = 'On Invoice';
    } else if (oldValue === 'off_invoice') {
      commercialDetails.invoice_discount_type = 'Off Invoice';
    }
  }
  
  // Migrate discount_basis from old format to new format (if needed)
  if (data.commercialDetails?.discount_basis) {
    const oldValue = data.commercialDetails.discount_basis as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commercialDetails = data.commercialDetails as any;
    if (oldValue === 'pts') {
      commercialDetails.discount_basis = 'PTS';
    } else if (oldValue === 'ptr') {
      commercialDetails.discount_basis = 'PTR';
    } else if (oldValue === 'mrp') {
      commercialDetails.discount_basis = 'MRP';
    }
  }
  
  // Migrate is_authorized_distributor from old format to new format
  if (data.commercialDetails?.is_authorized_distributor) {
    const oldValue = data.commercialDetails.is_authorized_distributor as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commercialDetails = data.commercialDetails as any;
    if (oldValue === 'yes') {
      commercialDetails.is_authorized_distributor = 'Yes';
    } else if (oldValue === 'no') {
      commercialDetails.is_authorized_distributor = 'No';
    }
  }
  
  // Migrate return_damage_type from old format to new format
  if (data.commercialDetails?.return_damage_type) {
    const oldValue = data.commercialDetails.return_damage_type as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commercialDetails = data.commercialDetails as any;
    if (oldValue === 'replacement') {
      commercialDetails.return_damage_type = 'Replacement';
    } else if (oldValue === '100_cn') {
      commercialDetails.return_damage_type = '100% CN';
    }
  }
  
  return data;
}

// Helper to load from localStorage
function loadFromCache(supplierId: string | null): Partial<OnboardingFormData> | null {
  if (!supplierId) return null;
  
  try {
    const cached = localStorage.getItem(`${STORAGE_KEY}-${supplierId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Check if migration is needed
      const needsMigration = 
        parsed.commercialDetails?.invoice_discount_type === 'on_invoice' ||
        parsed.commercialDetails?.invoice_discount_type === 'off_invoice' ||
        parsed.commercialDetails?.discount_basis === 'pts' ||
        parsed.commercialDetails?.discount_basis === 'ptr' ||
        parsed.commercialDetails?.discount_basis === 'mrp' ||
        parsed.commercialDetails?.is_authorized_distributor === 'yes' ||
        parsed.commercialDetails?.is_authorized_distributor === 'no' ||
        parsed.commercialDetails?.return_damage_type === 'replacement' ||
        parsed.commercialDetails?.return_damage_type === '100_cn';
      
      // Migrate old format to new format
      const migrated = migrateCachedData(parsed);
      
      // If migration occurred, save the migrated data back to cache
      if (needsMigration && migrated) {
        // Merge with initial form data to ensure all fields are present
        const fullFormData = { ...INITIAL_FORM_DATA, ...migrated } as OnboardingFormData;
        saveToCache(supplierId, fullFormData);
      }
      
      return migrated;
    }
  } catch (error) {
    console.warn('Failed to load from cache:', error);
  }
  return null;
}

// Helper to save to localStorage
function saveToCache(supplierId: string | null, formData: OnboardingFormData): void {
  if (!supplierId) return;
  
  try {
    const serialized = serializeFormData(formData);
    localStorage.setItem(`${STORAGE_KEY}-${supplierId}`, JSON.stringify(serialized));
  } catch (error) {
    console.warn('Failed to save to cache:', error);
  }
}

// Helper to clear cache
function clearCache(supplierId: string | null): void {
  if (!supplierId) return;
  
  try {
    localStorage.removeItem(`${STORAGE_KEY}-${supplierId}`);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

interface OnboardingStore {
  currentStep: number;
  formData: OnboardingFormData;
  isSubmitted: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  supplierId: string | null;
  supplierData: SupplierApiData | null;
  panVerificationStatus: 'success' | 'error' | 'pending' | null;
  gstVerificationStatus: 'success' | 'error' | 'pending' | null;
  bankVerificationStatus: 'success' | 'error' | 'pending' | null;
  msmeVerificationStatus: 'success' | 'error' | 'pending' | null;
  
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
  setPANVerificationStatus: (status: 'success' | 'error' | 'pending' | null) => void;
  setGSTVerificationStatus: (status: 'success' | 'error' | 'pending' | null) => void;
  setBankVerificationStatus: (status: 'success' | 'error' | 'pending' | null) => void;
  setMSMEVerificationStatus: (status: 'success' | 'error' | 'pending' | null) => void;
  
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
  panVerificationStatus: null,
  gstVerificationStatus: null,
  bankVerificationStatus: null,
  msmeVerificationStatus: null,

  nextStep: () => {
    const state = get();
    set({ currentStep: Math.min(state.currentStep + 1, 9) });
    // Save to cache after navigation
    saveToCache(state.supplierId, state.formData);
  },

  prevStep: () => {
    const state = get();
    set({ currentStep: Math.max(state.currentStep - 1, 1) });
    // Save to cache after navigation
    saveToCache(state.supplierId, state.formData);
  },

  goToStep: (step: number) => {
    const state = get();
    set({ currentStep: Math.min(Math.max(step, 1), 9) });
    // Save to cache after navigation
    saveToCache(state.supplierId, state.formData);
  },

  updateBasicInfo: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      basicInfo: { ...state.formData.basicInfo, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  updatePANDetails: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      panDetails: { ...state.formData.panDetails, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  updateGSTInfo: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      gstInfo: { ...state.formData.gstInfo, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  updateBankAccount: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      bankAccount: { ...state.formData.bankAccount, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  updateMSMEStatus: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      msmeStatus: { ...state.formData.msmeStatus, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  updateDrugLicense: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      drugLicense: { ...state.formData.drugLicense, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  updateContactInformation: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      contactInformation: { ...state.formData.contactInformation, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  updateCommercialDetails: (data) => {
    const state = get();
    const newFormData = {
      ...state.formData,
      commercialDetails: { ...state.formData.commercialDetails, ...data },
    };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  setTermsAccepted: (accepted) => {
    const state = get();
    const newFormData = { ...state.formData, termsAccepted: accepted };
    set({ formData: newFormData });
    saveToCache(state.supplierId, newFormData);
  },

  setPANVerificationStatus: (status) => set({ panVerificationStatus: status }),

  setGSTVerificationStatus: (status) => set({ gstVerificationStatus: status }),

  setBankVerificationStatus: (status) => set({ bankVerificationStatus: status }),

  setMSMEVerificationStatus: (status) => set({ msmeVerificationStatus: status }),

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

      // Load cached data if available
      const cachedData = loadFromCache(supplierId);
      
      // Merge: API data (base) + Cached data (user inputs) + Default values
      const mergedFormData: OnboardingFormData = {
        ...INITIAL_FORM_DATA,
        ...(cachedData || {}),
        basicInfo: {
          ...INITIAL_FORM_DATA.basicInfo,
          company_name: supplierData.supplier_name || cachedData?.basicInfo?.company_name || '',
          email: supplierData.email_id || cachedData?.basicInfo?.email || '',
          phone: supplierData.mobile_no || cachedData?.basicInfo?.phone || '',
          ...(cachedData?.basicInfo || {}),
        },
        panDetails: {
          ...INITIAL_FORM_DATA.panDetails,
          pan_number: supplierData.pan || cachedData?.panDetails?.pan_number || '',
          ...(cachedData?.panDetails || {}),
        },
        gstInfo: {
          ...INITIAL_FORM_DATA.gstInfo,
          gst_status: gstStatus || cachedData?.gstInfo?.gst_status || '',
          gst_number: supplierData.gstin || cachedData?.gstInfo?.gst_number || '',
          ...(cachedData?.gstInfo || {}),
        },
        bankAccount: {
          ...INITIAL_FORM_DATA.bankAccount,
          ...(cachedData?.bankAccount || {}),
        },
        msmeStatus: {
          ...INITIAL_FORM_DATA.msmeStatus,
          ...(cachedData?.msmeStatus || {}),
        },
        drugLicense: {
          ...INITIAL_FORM_DATA.drugLicense,
          ...(cachedData?.drugLicense || {}),
        },
        contactInformation: {
          ...INITIAL_FORM_DATA.contactInformation,
          ...(cachedData?.contactInformation || {}),
        },
        commercialDetails: {
          ...INITIAL_FORM_DATA.commercialDetails,
          ...(cachedData?.commercialDetails || {}),
        },
        termsAccepted: cachedData?.termsAccepted || false,
      };

      set({
        supplierData,
        formData: mergedFormData,
        isLoading: false,
      });
      
      // Save merged data to cache
      saveToCache(supplierId, mergedFormData);
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
        msmeStatus: formData.msmeStatus,
        contactInformation: formData.contactInformation,
        commercialDetails: formData.commercialDetails,
      });

      if (result.success) {
        // Clear cache on successful submission
        clearCache(supplierId);
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

  resetForm: () => {
    const state = get();
    // Clear cache when resetting
    clearCache(state.supplierId);
    set({
      currentStep: 1,
      formData: INITIAL_FORM_DATA,
      isSubmitted: false,
      isSubmitting: false,
      error: null,
      panVerificationStatus: null,
      gstVerificationStatus: null,
      bankVerificationStatus: null,
      msmeVerificationStatus: null,
    });
  },
}));
