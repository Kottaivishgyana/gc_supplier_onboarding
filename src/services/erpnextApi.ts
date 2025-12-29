/**
 * ERPNext API Service for Supplier Onboarding
 * 
 * This service handles all API communications with Frappe ERPNext
 */

// API Configuration - Update these values for your ERPNext instance
const RAW_API_URL = import.meta.env.VITE_ERPNEXT_API_URL ;
// Remove trailing slash to avoid double slashes in URLs
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');
const API_KEY = import.meta.env.VITE_ERPNEXT_API_KEY || '';
const API_SECRET = import.meta.env.VITE_ERPNEXT_API_SECRET || '';

interface ApiResponse<T> {
  message?: T;
  data?: T;
  exc_type?: string;
  exception?: string;
  _server_messages?: string;
}

interface SupplierData {
  name: string;
  supplier_name: string;
  email_id: string | null;
  mobile_no: string | null;
  gstin: string | null;
  pan: string | null;
  gst_category: string | null;
  primary_address: string | null;
  supplier_type: string;
  country: string;
}

interface SupplierUpdatePayload {
  supplier_name: string;
  email_id: string;
  mobile_no: string;
  pan: string;
  gstin: string;
  gst_category: string;
}

interface AddressPayload {
  doctype: string;
  address_title: string;
  address_type: string;
  address_line1: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_primary_address: number;
  is_shipping_address: number;
  links: {
    link_doctype: string;
    link_name: string;
  }[];
}

interface BankAccountPayload {
  doctype: string;
  account_name: string;
  bank: string;
  branch_code: string;
  bank_account_no: string;
  iban: string;
  party_type: string;
  party: string;
  is_default: number;
  is_company_account: number;
}

// Request headers with authentication
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (API_KEY && API_SECRET) {
    headers['Authorization'] = `token ${API_KEY}:${API_SECRET}`;
  }

  return headers;
}

/**
 * Fetch supplier details by name (document name/ID)
 */
export async function getSupplier(supplierName: string): Promise<SupplierData> {
  const response = await fetch(
    `${API_BASE_URL}/api/resource/Supplier/${encodeURIComponent(supplierName)}`,
    {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'omit',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch supplier: ${response.statusText}`);
  }

  const result: ApiResponse<SupplierData> = await response.json();
  
  if (!result.data) {
    throw new Error('Supplier not found');
  }

  return result.data;
}

/**
 * Update supplier with onboarding data
 */
export async function updateSupplier(
  supplierName: string,
  data: SupplierUpdatePayload
): Promise<SupplierData> {
  const response = await fetch(
    `${API_BASE_URL}/api/resource/Supplier/${encodeURIComponent(supplierName)}`,
    {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.exception || `Failed to update supplier: ${response.statusText}`);
  }

  const result: ApiResponse<SupplierData> = await response.json();
  return result.data as SupplierData;
}

/**
 * Create or update address for supplier
 */
export async function createAddress(
  supplierName: string,
  addressData: {
    address_line1: string;
    city: string;
    state: string;
    pincode: string;
  }
): Promise<void> {
  const payload: AddressPayload = {
    doctype: 'Address',
    address_title: `${supplierName}-Billing`,
    address_type: 'Billing',
    address_line1: addressData.address_line1,
    city: addressData.city,
    state: addressData.state,
    country: 'India',
    pincode: addressData.pincode,
    is_primary_address: 1,
    is_shipping_address: 1,
    links: [
      {
        link_doctype: 'Supplier',
        link_name: supplierName,
      },
    ],
  };

  const response = await fetch(`${API_BASE_URL}/api/resource/Address`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.exception || `Failed to create address: ${response.statusText}`);
  }
}

/**
 * Create bank account for supplier
 */
export async function createBankAccount(
  supplierName: string,
  bankData: {
    account_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
    branch_name: string;
  }
): Promise<void> {
  // First, ensure the Bank exists
  await ensureBankExists(bankData.bank_name);

  const payload: BankAccountPayload = {
    doctype: 'Bank Account',
    account_name: `${supplierName} - ${bankData.bank_name}`,
    bank: bankData.bank_name,
    branch_code: bankData.ifsc_code,
    bank_account_no: bankData.account_number,
    iban: '', // Not required for Indian banks
    party_type: 'Supplier',
    party: supplierName,
    is_default: 1,
    is_company_account: 0,
  };

  const response = await fetch(`${API_BASE_URL}/api/resource/Bank Account`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.exception || `Failed to create bank account: ${response.statusText}`);
  }
}

/**
 * Ensure bank exists in ERPNext
 */
async function ensureBankExists(bankName: string): Promise<void> {
  // Check if bank exists
  const checkResponse = await fetch(
    `${API_BASE_URL}/api/resource/Bank/${encodeURIComponent(bankName)}`,
    {
      method: 'GET',
      headers: getHeaders(),
    }
  );

  if (checkResponse.ok) {
    return; // Bank exists
  }

  // Create bank if it doesn't exist
  const createResponse = await fetch(`${API_BASE_URL}/api/resource/Bank`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      doctype: 'Bank',
      bank_name: bankName,
    }),
  });

  if (!createResponse.ok && createResponse.status !== 409) {
    // 409 = already exists, which is fine
    console.warn(`Could not create bank: ${bankName}`);
  }
}

/**
 * Main function to submit all onboarding data
 */
export async function submitOnboardingData(
  supplierName: string,
  formData: {
    basicInfo: {
      company_name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    panDetails: {
      pan_number: string;
    };
    gstInfo: {
      gst_status: string;
      gst_number: string;
    };
    bankAccount: {
      account_name: string;
      account_number: string;
      ifsc_code: string;
      bank_name: string;
      branch_name: string;
    };
  }
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Update supplier main document
    const supplierPayload: SupplierUpdatePayload = {
      supplier_name: formData.basicInfo.company_name,
      email_id: formData.basicInfo.email,
      mobile_no: formData.basicInfo.phone,
      pan: formData.panDetails.pan_number,
      gstin: formData.gstInfo.gst_status === 'registered' ? formData.gstInfo.gst_number : '',
      gst_category: formData.gstInfo.gst_status === 'registered' ? 'Registered Regular' : 'Unregistered',
    };

    await updateSupplier(supplierName, supplierPayload);

    // 2. Create address
    await createAddress(supplierName, {
      address_line1: formData.basicInfo.address,
      city: formData.basicInfo.city,
      state: formData.basicInfo.state,
      pincode: formData.basicInfo.pincode,
    });

    // 3. Create bank account
    await createBankAccount(supplierName, formData.bankAccount);

    return {
      success: true,
      message: 'Onboarding data submitted successfully',
    };
  } catch (error) {
    console.error('Onboarding submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit onboarding data',
    };
  }
}

/**
 * Parse address string to components
 * Frappe stores address as HTML with <br> tags
 */
export function parseAddressString(addressHtml: string | null): {
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
} {
  if (!addressHtml) {
    return { address_line1: '', city: '', state: '', pincode: '' };
  }

  const lines = addressHtml.split('<br>').map((line) => line.trim()).filter(Boolean);
  
  return {
    address_line1: lines[0] || '',
    city: lines[1] || '',
    state: lines.find((l) => l.includes('State Code'))?.split(',')[0]?.replace('Tamil Nadu', 'Tamil Nadu') || '',
    pincode: lines.find((l) => l.includes('PIN Code'))?.match(/\d{6}/)?.[0] || '',
  };
}

