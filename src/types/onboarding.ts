export interface BasicInfoData {
  company_name: string;
  email: string;
  phone: string;
  business_type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  billing_address_different: boolean;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_pincode: string;
}

export interface PANDetailsData {
  pan_number: string;
  full_name: string;
  dob: string; // YYYY-MM-DD
  pan_document?: File | null;
}

export interface GSTInfoData {
  gst_status: 'registered' | 'not_registered' | '';
  gst_number: string;
  gst_document?: File | null;
}

export interface BankAccountData {
  account_name: string;
  account_number: string;
  confirm_account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  micr?: string;
}

export interface MSMEStatusData {
  msme_status: 'yes' | 'no' | '';
  msme_number: string;
  msme_type: 'Micro' | 'Small' | 'Medium' | '';
  msme_document?: File | null;
  // MSME verification response data
  verification_data?: {
    name_of_enterprise?: string;
    major_activity?: string;
    date_of_commencement?: string;
    organization_type?: string;
    address?: string;
    enterprise_type_list?: Array<{
      classification_year: string;
      enterprise_type: string;
      classification_date: string;
    }>;
  };
}

export interface DrugLicenseData {
  // Whether the vendor has a drug license (similar to MSME yes/no)
  drug_license_status: 'yes' | 'no' | '';
  drug_license_number: string;
  drug_license_document?: File | null;
}

export interface ContactItem {
  name: string;
  contact: string;
  email: string;
  role?: 'hod' | 'proprietor' | 'head' | '';
}

export interface ContactInformationData {
  transaction_name: string;
  transaction_contact: string;
  transaction_email: string;
  escalation_name: string;
  escalation_role: 'hod' | 'proprietor' | 'head' | '';
  escalation_contact: string;
  escalation_email: string;
  additional_contact2_name: string;
  additional_contact2_role: 'hod' | 'proprietor' | 'head' | '';
  additional_contact2: string;
  additional_contact2_email: string;
  additional_contact_name?: string;
  additional_contact?: string;
  additional_contact_email?: string;
  additional_contact_role?: 'hod' | 'proprietor' | 'head' | '';
}

export interface AuthorizedDistributorItem {
  manufacturer_name: string;
  document?: File | null;
}

export interface CommercialDetailsData {
  credit_days: string;
  delivery: string;
  discount_basis: 'PTS' | 'PTR' | 'MRP' | '';
  invoice_discount_type: 'On Invoice' | 'Off Invoice' | '';
  invoice_discount_percentage: string;
  is_authorized_distributor: 'Yes' | 'No' | '';
  authorized_distributors?: AuthorizedDistributorItem[];
  return_non_moving: string;
  return_short_expiry_percentage: string;
  return_damage_type: 'Replacement' | '100% CN' | '';
  return_expired_percentage: string;
}

export interface SelfDeclarationData {
  self_declaration_agreed: boolean;
  self_declaration_document?: File | null;
}

export interface OnboardingFormData {
  basicInfo: BasicInfoData;
  panDetails: PANDetailsData;
  gstInfo: GSTInfoData;
  bankAccount: BankAccountData;
  msmeStatus: MSMEStatusData;
  drugLicense: DrugLicenseData;
  contactInformation: ContactInformationData;
  commercialDetails: CommercialDetailsData;
  selfDeclaration: SelfDeclarationData;
  termsAccepted: boolean;
}

// Supplier data from ERPNext (full data including custom fields)
export interface SupplierApiData {
  name: string;
  supplier_name: string;
  email_id: string | null;
  mobile_no: string | null;
  custom_phone_no?: string;
  gstin: string | null;
  pan: string | null;
  gst_category: string | null;
  primary_address: string | null;
  supplier_type: string | null;
  country: string | null;
  // Custom fields
  custom_business_type?: string;
  custom_drug_license?: string;
  custom_drug_license_no?: string;
  custom_verification_status?: string;
  // Contact Information
  custom_transaction_contact_name?: string;
  custom_transaction_contact?: string;
  custom_transaction_email?: string;
  custom_escalation_contact_name?: string;
  custom_escalation_role?: string;
  custom_escalation_contact?: string;
  custom_escalation_email?: string;
  custom_contact_name_2?: string;
  custom_role_2?: string;
  custom_contact_2?: string;
  custom_email_2?: string;
  custom_contact_name_3?: string;
  custom_role_3?: string;
  custom_contact_3?: string;
  custom_email_3?: string;
  // Commercial Details
  custom_credit_days_from_delivery_date?: string;
  custom_delivery?: string;
  custom_discount_?: string;
  custom_invoice_discount_type?: string;
  custom_invoice_discount_?: number;
  custom_manufacturers_authorized_distributor?: string;
  custom_return_policy__non_moving?: string;
  custom_return_policy__short_expiry_less_than_90_days_?: number;
  custom_return_policy__damage?: string;
  custom_return_policy__expired_?: number;
  // Attachment URLs
  custom_pan_img?: string;
  custom_gst_img?: string;
  custom_drug_licence_img?: string;
  custom_msme_certificate_?: string;
  // Self Declaration
  custom_self_declaration?: string;
  // MSME / Udyam
  custom_msme__udyam_number?: string;
  custom_msme_registration_no?: string;
  custom_msme_type?: string;
  custom_msme_registered?: string;
  custom_contract_done?: string;
  custom_name_of_enterprise?: string;
  custom_major_activity?: string;
  custom_date_of_commencement?: string;
  custom_organization_of_type?: string;
  custom_address?: string;
  // Child tables
  custom_bank_account_details?: Array<{
    name: string;
    account_holder_name?: string;
    account_number?: string;
    ifsc_code?: string;
    bank_name?: string;
    branch_name?: string;
    micr?: string;
  }>;
  custom_enterprise_type_list?: Array<{
    name: string;
    name_of_enterprise?: string;
    major_activity?: string;
    date_of_commencement?: string;
  }>;
  custom_authorized_distributors?: Array<{
    name: string;
    manufacturer_name?: string;
    document?: string;
  }>;
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const STEPS: StepConfig[] = [
  { id: 1, title: 'Basic Info', description: 'Company details', icon: 'badge' },
  { id: 2, title: 'Contact Information', description: 'Contact details', icon: 'contact_mail' },
  { id: 3, title: 'PAN Details', description: 'Tax verification', icon: 'id_card' },
  { id: 4, title: 'GST Info', description: 'GST registration', icon: 'receipt_long' },
  { id: 5, title: 'Bank Account', description: 'Payment details', icon: 'account_balance' },
  { id: 6, title: 'MSME Status', description: 'Enterprise category', icon: 'store' },
  { id: 7, title: 'Drug License', description: 'License information', icon: 'medical_services' },
  { id: 8, title: 'Commercial Details', description: 'Commercial terms', icon: 'receipt' },
  { id: 9, title: 'Self Declaration', description: 'Declaration certificate', icon: 'verified' },
  { id: 10, title: 'Review & Submit', description: 'Final review', icon: 'send' },
];

export const INITIAL_FORM_DATA: OnboardingFormData = {
  basicInfo: {
    company_name: '',
    email: '',
    phone: '',
    business_type: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    billing_address_different: false,
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_pincode: '',
  },
  panDetails: {
    pan_number: '',
    full_name: '',
    dob: '',
    pan_document: null,
  },
  gstInfo: {
    gst_status: '',
    gst_number: '',
    gst_document: null,
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
    msme_type: '',
    msme_document: null,
    verification_data: undefined,
  },
  drugLicense: {
    drug_license_status: '',
    drug_license_number: '',
    drug_license_document: null,
  },
  contactInformation: {
    transaction_name: '',
    transaction_contact: '',
    transaction_email: '',
    escalation_name: '',
    escalation_role: '',
    escalation_contact: '',
    escalation_email: '',
    additional_contact2_name: '',
    additional_contact2_role: '',
    additional_contact2: '',
    additional_contact2_email: '',
    additional_contact_name: '',
    additional_contact: '',
    additional_contact_email: '',
    additional_contact_role: '',
  },
  commercialDetails: {
    credit_days: '45',
    delivery: 'At our works at your cost',
    discount_basis: '',
    invoice_discount_type: '',
    invoice_discount_percentage: '',
    is_authorized_distributor: '',
    authorized_distributors: [],
    return_non_moving: '100',
    return_short_expiry_percentage: '',
    return_damage_type: '',
    return_expired_percentage: '',
  },
  selfDeclaration: {
    self_declaration_agreed: false,
    self_declaration_document: null,
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
