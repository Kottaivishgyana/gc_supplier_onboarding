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

// Helper to convert File to base64 string
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper to convert base64 string back to File
function base64ToFile(base64: string, fileName: string, mimeType: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}

// Helper to serialize form data (converting File objects to base64)
async function serializeFormData(formData: OnboardingFormData): Promise<Partial<OnboardingFormData> & { 
  _fileData?: {
    pan_document?: { base64: string; name: string; type: string };
    gst_document?: { base64: string; name: string; type: string };
    drug_license_document?: { base64: string; name: string; type: string };
    msme_document?: { base64: string; name: string; type: string };
    authorized_distributors?: Array<{ manufacturer_name: string; document?: { base64: string; name: string; type: string } }>;
  };
}> {
  const fileData: {
    pan_document?: { base64: string; name: string; type: string };
    gst_document?: { base64: string; name: string; type: string };
    drug_license_document?: { base64: string; name: string; type: string };
    msme_document?: { base64: string; name: string; type: string };
    authorized_distributors?: Array<{ manufacturer_name: string; document?: { base64: string; name: string; type: string } }>;
  } = {};

  if (formData.panDetails.pan_document) {
    try {
      fileData.pan_document = {
        base64: await fileToBase64(formData.panDetails.pan_document),
        name: formData.panDetails.pan_document.name,
        type: formData.panDetails.pan_document.type,
      };
    } catch (error) {
      console.warn('Failed to serialize PAN document:', error);
    }
  }

  if (formData.gstInfo.gst_document) {
    try {
      fileData.gst_document = {
        base64: await fileToBase64(formData.gstInfo.gst_document),
        name: formData.gstInfo.gst_document.name,
        type: formData.gstInfo.gst_document.type,
      };
    } catch (error) {
      console.warn('Failed to serialize GST document:', error);
    }
  }

  if (formData.drugLicense.drug_license_document) {
    try {
      fileData.drug_license_document = {
        base64: await fileToBase64(formData.drugLicense.drug_license_document),
        name: formData.drugLicense.drug_license_document.name,
        type: formData.drugLicense.drug_license_document.type,
      };
    } catch (error) {
      console.warn('Failed to serialize drug license document:', error);
    }
  }

  if (formData.msmeStatus.msme_document) {
    try {
      fileData.msme_document = {
        base64: await fileToBase64(formData.msmeStatus.msme_document),
        name: formData.msmeStatus.msme_document.name,
        type: formData.msmeStatus.msme_document.type,
      };
    } catch (error) {
      console.warn('Failed to serialize MSME document:', error);
    }
  }

  if (formData.commercialDetails.authorized_distributors) {
    fileData.authorized_distributors = await Promise.all(
      formData.commercialDetails.authorized_distributors.map(async (item) => {
        if (item.document) {
          try {
            return {
              manufacturer_name: item.manufacturer_name,
              document: {
                base64: await fileToBase64(item.document),
                name: item.document.name,
                type: item.document.type,
              },
            };
          } catch (error) {
            console.warn(`Failed to serialize authorized distributor document for ${item.manufacturer_name}:`, error);
            return { manufacturer_name: item.manufacturer_name };
          }
        }
        return { manufacturer_name: item.manufacturer_name };
      })
    );
  }

  return {
    ...formData,
    panDetails: {
      ...formData.panDetails,
      pan_document: null, // File removed, stored in _fileData
    },
    gstInfo: {
      ...formData.gstInfo,
      gst_document: null, // File removed, stored in _fileData
    },
    drugLicense: {
      ...formData.drugLicense,
      drug_license_document: null, // File removed, stored in _fileData
    },
    msmeStatus: {
      ...formData.msmeStatus,
      msme_document: null, // File removed, stored in _fileData
    },
    commercialDetails: {
      ...formData.commercialDetails,
      authorized_distributors: formData.commercialDetails.authorized_distributors?.map(item => ({
        manufacturer_name: item.manufacturer_name,
        document: null, // File removed, stored in _fileData
      })),
    },
    _fileData: fileData,
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

// Helper to load from localStorage and restore File objects
function loadFromCache(supplierId: string | null): Partial<OnboardingFormData> | null {
  if (!supplierId) return null;
  
  try {
    const cached = localStorage.getItem(`${STORAGE_KEY}-${supplierId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      const fileData = parsed._fileData;
      
      // Restore File objects from base64
      if (fileData) {
        if (fileData.pan_document) {
          parsed.panDetails = parsed.panDetails || {};
          parsed.panDetails.pan_document = base64ToFile(
            fileData.pan_document.base64,
            fileData.pan_document.name,
            fileData.pan_document.type
          );
        }
        
        if (fileData.gst_document) {
          parsed.gstInfo = parsed.gstInfo || {};
          parsed.gstInfo.gst_document = base64ToFile(
            fileData.gst_document.base64,
            fileData.gst_document.name,
            fileData.gst_document.type
          );
        }
        
        if (fileData.drug_license_document) {
          parsed.drugLicense = parsed.drugLicense || {};
          parsed.drugLicense.drug_license_document = base64ToFile(
            fileData.drug_license_document.base64,
            fileData.drug_license_document.name,
            fileData.drug_license_document.type
          );
        }
        
        if (fileData.msme_document) {
          parsed.msmeStatus = parsed.msmeStatus || {};
          parsed.msmeStatus.msme_document = base64ToFile(
            fileData.msme_document.base64,
            fileData.msme_document.name,
            fileData.msme_document.type
          );
        }
        
        if (fileData.authorized_distributors) {
          parsed.commercialDetails = parsed.commercialDetails || {};
          parsed.commercialDetails.authorized_distributors = fileData.authorized_distributors.map((item: { manufacturer_name: string; document?: { base64: string; name: string; type: string } }) => ({
            manufacturer_name: item.manufacturer_name,
            document: item.document ? base64ToFile(
              item.document.base64,
              item.document.name,
              item.document.type
            ) : null,
          }));
        }
      }
      
      // Remove _fileData from parsed object
      delete parsed._fileData;
      
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
        // Note: File restoration happens in loadFromCache, so we save without files here
        saveToCache(supplierId, fullFormData);
      }
      
      return migrated;
    }
  } catch (error) {
    console.warn('Failed to load from cache:', error);
  }
  return null;
}

// Helper to save to localStorage (async, fire-and-forget)
function saveToCache(supplierId: string | null, formData: OnboardingFormData): void {
  if (!supplierId) return;
  
  // Fire and forget - don't block UI
  serializeFormData(formData)
    .then((serialized) => {
      localStorage.setItem(`${STORAGE_KEY}-${supplierId}`, JSON.stringify(serialized));
    })
    .catch((error) => {
      console.warn('Failed to save to cache:', error);
    });
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
