export interface BasicInfoData {
  company_name: string;
  email: string;
  phone: string;
  address: string;
}

export interface PANDetailsData {
  pan_number: string;
  pan_name: string;
}

export interface GSTInfoData {
  gst_status: 'registered' | 'not_registered' | '';
  gst_number: string;
  gst_state: string;
}

export interface BankAccountData {
  account_name: string;
  account_number: string;
  confirm_account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
}

export interface MSMEStatusData {
  msme_status: 'yes' | 'no' | '';
  msme_number: string;
  msme_category: string;
}

export interface OnboardingFormData {
  basicInfo: BasicInfoData;
  panDetails: PANDetailsData;
  gstInfo: GSTInfoData;
  bankAccount: BankAccountData;
  msmeStatus: MSMEStatusData;
  termsAccepted: boolean;
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const STEPS: StepConfig[] = [
  { id: 1, title: 'Basic Info', description: 'Company details', icon: 'badge' },
  { id: 2, title: 'PAN Details', description: 'Tax verification', icon: 'id_card' },
  { id: 3, title: 'GST Info', description: 'GST registration', icon: 'receipt_long' },
  { id: 4, title: 'Bank Account', description: 'Payment details', icon: 'account_balance' },
  { id: 5, title: 'MSME Status', description: 'Enterprise category', icon: 'store' },
  { id: 6, title: 'Review & Submit', description: 'Final review', icon: 'send' },
];

export const INITIAL_FORM_DATA: OnboardingFormData = {
  basicInfo: {
    company_name: '',
    email: '',
    phone: '',
    address: '',
  },
  panDetails: {
    pan_number: '',
    pan_name: '',
  },
  gstInfo: {
    gst_status: '',
    gst_number: '',
    gst_state: '',
  },
  bankAccount: {
    account_name: '',
    account_number: '',
    confirm_account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
  },
  msmeStatus: {
    msme_status: '',
    msme_number: '',
    msme_category: '',
  },
  termsAccepted: false,
};

export const INDIAN_STATES = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OR', label: 'Odisha' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UK', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' },
];
