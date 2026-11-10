/**
 * KYC Verification Service
 *
 * All verification calls routed through ERPNext server scripts.
 * SurePass is called server-side only — tokens and raw responses never reach the browser.
 */

const RAW_API_URL = import.meta.env.VITE_ERPNEXT_API_URL || '';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');
const API_KEY = import.meta.env.VITE_ERPNEXT_API_KEY || '';
const API_SECRET = import.meta.env.VITE_ERPNEXT_API_SECRET || '';

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

async function callServerMethod<T>(method: string, params: Record<string, string>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/method/${method}`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'X-Frappe-CSRF-Token': 'token',
    },
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errorMessage = 'Verification failed. Please try again.';
    try {
      const errorData = await response.json();
      if (errorData._server_messages) {
        const parsed = JSON.parse(errorData._server_messages);
        const msg = typeof parsed[0] === 'string' ? JSON.parse(parsed[0])?.message : parsed[0];
        if (msg) errorMessage = msg;
      } else if (errorData.message && !errorData.message.includes('exc_id')) {
        errorMessage = errorData.message;
      }
    } catch {
      // use default error message
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.message as T;
}

// --- PAN Verification ---

interface PANVerifyRequest {
  pan_number: string;
  uhid: string;
}

interface PANVerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    full_name?: string;
    dob?: string;
    status?: string;
    category?: string;
  };
}

export async function verifyPAN(data: PANVerifyRequest): Promise<PANVerifyResponse> {
  try {
    const result = await callServerMethod<PANVerifyResponse & Record<string, unknown>>('verify_pan', {
      pan_number: data.pan_number.toUpperCase().trim(),
      uhid: data.uhid,
    });
    // Normalize: server script may return { success, data } or flat { full_name, dob, ... }
    if (result.success !== undefined) return result as PANVerifyResponse;
    if (result.full_name || result.dob) {
      return { success: true, data: { full_name: result.full_name as string, dob: result.dob as string, status: result.status as string, category: result.category as string } };
    }
    return result as PANVerifyResponse;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify PAN. Please try again.',
    };
  }
}

// --- GST Verification ---

interface GSTVerifyRequest {
  gstin: string;
  uhid: string;
}

interface GSTVerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    gstin?: string;
    business_name?: string;
    legal_name?: string;
    gstin_status?: string;
  };
}

export async function verifyGST(data: GSTVerifyRequest): Promise<GSTVerifyResponse> {
  try {
    const result = await callServerMethod<GSTVerifyResponse & Record<string, unknown>>('verify_gst', {
      gstin: data.gstin.toUpperCase().trim(),
      uhid: data.uhid,
    });
    if (result.success !== undefined) return result as GSTVerifyResponse;
    if (result.gstin || result.business_name) {
      return { success: true, data: { gstin: result.gstin as string, business_name: result.business_name as string, legal_name: result.legal_name as string, gstin_status: result.gstin_status as string } };
    }
    return result as GSTVerifyResponse;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify GST. Please try again.',
    };
  }
}

// --- Bank Account Verification ---

interface BankAccountVerifyRequest {
  account_number: string;
  ifsc_code: string;
  uhid: string;
}

interface BankAccountVerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    account_holder_name?: string;
    bank_name?: string;
    branch_name?: string;
    micr?: string;
    account_exists?: boolean;
  };
}

export async function verifyBankAccount(data: BankAccountVerifyRequest): Promise<BankAccountVerifyResponse> {
  try {
    const result = await callServerMethod<BankAccountVerifyResponse & Record<string, unknown>>('verify_bank_account', {
      account_number: data.account_number.trim(),
      ifsc_code: data.ifsc_code.toUpperCase().trim(),
      uhid: data.uhid,
    });
    if (result.success !== undefined) return result as BankAccountVerifyResponse;
    if (result.account_holder_name || result.bank_name) {
      return { success: true, data: { account_holder_name: result.account_holder_name as string, bank_name: result.bank_name as string, branch_name: result.branch_name as string, micr: result.micr as string, account_exists: result.account_exists as boolean } };
    }
    return result as BankAccountVerifyResponse;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify bank account. Please try again.',
    };
  }
}

// --- MSME Verification ---

interface MSMEVerifyRequest {
  uan: string;
  uhid: string;
}

interface MSMEVerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    name_of_enterprise?: string;
    major_activity?: string;
    date_of_commencement?: string;
    organization_type?: string;
    address?: string;
    enterprise_type_list?: Array<{
      classification_year?: string;
      enterprise_type?: string;
      classification_date?: string;
    }>;
  };
}

export async function verifyMSME(data: MSMEVerifyRequest): Promise<MSMEVerifyResponse> {
  try {
    const result = await callServerMethod<MSMEVerifyResponse & Record<string, unknown>>('verify_msme', {
      uan: data.uan.toUpperCase().trim(),
      uhid: data.uhid,
    });
    if (result.success !== undefined) return result as MSMEVerifyResponse;
    if (result.name_of_enterprise) {
      return { success: true, data: result as MSMEVerifyResponse['data'] };
    }
    return result as MSMEVerifyResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError' ||
          error.message.includes('timeout') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('network')) {
        return {
          success: false,
          message: 'Server busy try after sometime',
        };
      }
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify MSME. Please try again.',
    };
  }
}
