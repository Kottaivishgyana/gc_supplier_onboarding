export interface BasicInfoData {
  company_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PANDetailsData {
  pan_number: string;
}

export interface GSTInfoData {
  gst_status: 'registered' | 'not_registered' | '';
  gst_number: string;
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
}

export interface OnboardingFormData {
  basicInfo: BasicInfoData;
  panDetails: PANDetailsData;
  gstInfo: GSTInfoData;
  bankAccount: BankAccountData;
  msmeStatus: MSMEStatusData;
  termsAccepted: boolean;
}

// Supplier data from ERPNext
export interface SupplierApiData {
  name: string;
  supplier_name: string;
  email_id: string | null;
  mobile_no: string | null;
  gstin: string | null;
  pan: string | null;
  gst_category: string | null;
  primary_address: string | null;
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
    city: '',
    state: '',
    pincode: '',
  },
  panDetails: {
    pan_number: '',
  },
  gstInfo: {
    gst_status: '',
    gst_number: '',
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
  },
  termsAccepted: false,
};

export const INDIAN_STATES = [
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands', code: '35' },
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh', code: '37' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh', code: '12' },
  { value: 'Assam', label: 'Assam', code: '18' },
  { value: 'Bihar', label: 'Bihar', code: '10' },
  { value: 'Chandigarh', label: 'Chandigarh', code: '04' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh', code: '22' },
  { value: 'Dadra and Nagar Haveli', label: 'Dadra and Nagar Haveli', code: '26' },
  { value: 'Daman and Diu', label: 'Daman and Diu', code: '25' },
  { value: 'Delhi', label: 'Delhi', code: '07' },
  { value: 'Goa', label: 'Goa', code: '30' },
  { value: 'Gujarat', label: 'Gujarat', code: '24' },
  { value: 'Haryana', label: 'Haryana', code: '06' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh', code: '02' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir', code: '01' },
  { value: 'Jharkhand', label: 'Jharkhand', code: '20' },
  { value: 'Karnataka', label: 'Karnataka', code: '29' },
  { value: 'Kerala', label: 'Kerala', code: '32' },
  { value: 'Ladakh', label: 'Ladakh', code: '38' },
  { value: 'Lakshadweep', label: 'Lakshadweep', code: '31' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh', code: '23' },
  { value: 'Maharashtra', label: 'Maharashtra', code: '27' },
  { value: 'Manipur', label: 'Manipur', code: '14' },
  { value: 'Meghalaya', label: 'Meghalaya', code: '17' },
  { value: 'Mizoram', label: 'Mizoram', code: '15' },
  { value: 'Nagaland', label: 'Nagaland', code: '13' },
  { value: 'Odisha', label: 'Odisha', code: '21' },
  { value: 'Puducherry', label: 'Puducherry', code: '34' },
  { value: 'Punjab', label: 'Punjab', code: '03' },
  { value: 'Rajasthan', label: 'Rajasthan', code: '08' },
  { value: 'Sikkim', label: 'Sikkim', code: '11' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu', code: '33' },
  { value: 'Telangana', label: 'Telangana', code: '36' },
  { value: 'Tripura', label: 'Tripura', code: '16' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh', code: '09' },
  { value: 'Uttarakhand', label: 'Uttarakhand', code: '05' },
  { value: 'West Bengal', label: 'West Bengal', code: '19' },
];
