/**
 * KYC Verification Service
 *
 * All verification calls routed through ERPNext server scripts.
 * SurePass is called server-side only — tokens and raw responses never reach the browser.
 */

const RAW_API_URL = import.meta.env.VITE_ERPNEXT_API_URL || '';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

async function callServerMethod<T>(method: string, params: Record<string, string>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/method/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    // Rate limit exceeded
    if (response.status === 429) {
      throw new Error('Too many attempts. Please wait a minute and try again.');
    }

    // HTML response (daily limit / service down)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Service temporarily unavailable. Please try again later.');
    }

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
    return await callServerMethod<PANVerifyResponse>('geri_care.api.kyc.verify_pan', {
      pan_number: data.pan_number.toUpperCase().trim(),
      uhid: data.uhid,
    });
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
    return await callServerMethod<GSTVerifyResponse>('geri_care.api.kyc.verify_gst', {
      gstin: data.gstin.toUpperCase().trim(),
      uhid: data.uhid,
    });
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
    return await callServerMethod<BankAccountVerifyResponse>('geri_care.api.kyc.verify_bank_account', {
      account_number: data.account_number.trim(),
      ifsc_code: data.ifsc_code.toUpperCase().trim(),
      uhid: data.uhid,
    });
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
    return await callServerMethod<MSMEVerifyResponse>('geri_care.api.kyc.verify_msme', {
      uan: data.uan.toUpperCase().trim(),
      uhid: data.uhid,
    });
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
