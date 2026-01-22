/**
 * SurePass API Service for PAN, GST, Bank Account, and MSME Verification
 */

const SUREPASS_BASE_URL = import.meta.env.VITE_SUREPASS_BASE_URL || '';
const SUREPASS_AUTH_TOKEN = import.meta.env.VITE_SUREPASS_AUTH_TOKEN || '';

interface PANVerifyRequest {
  pan_number: string;
  full_name: string;
  dob: string; // YYYY-MM-DD format
}

interface PANVerifyResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Verify PAN details using SurePass API
 */
export async function verifyPAN(data: PANVerifyRequest): Promise<PANVerifyResponse> {
  if (!SUREPASS_BASE_URL) {
    throw new Error('VITE_SUREPASS_BASE_URL is not configured');
  }

  if (!SUREPASS_AUTH_TOKEN) {
    throw new Error('VITE_SUREPASS_AUTH_TOKEN is not configured');
  }

  // Remove trailing slash from base URL
  const baseUrl = SUREPASS_BASE_URL.replace(/\/+$/, '');
  const url = `${baseUrl}/api/v1/pan/pan-verify`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${SUREPASS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        id_number: data.pan_number.toUpperCase().trim(),
        full_name: data.full_name.trim(),
        dob: data.dob,
      }),
    });

    if (response.status === 200) {
      const responseData = await response.json().catch(() => ({}));
      return {
        success: true,
        message: 'PAN verified successfully',
        data: responseData,
      };
    }

    // Handle non-200 responses
    let errorMessage = 'PAN verification failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = `PAN verification failed: ${response.statusText}`;
    }

    return {
      success: false,
      message: errorMessage,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify PAN. Please try again.',
    };
  }
}

interface GSTVerifyRequest {
  gstin: string;
}

interface GSTVerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    data?: {
      gstin?: string;
      business_name?: string;
      legal_name?: string;
      gstin_status?: string;
      [key: string]: unknown;
    };
    status_code?: number;
    success?: boolean;
    message?: string;
    message_code?: string;
  };
}

/**
 * Verify GSTIN using SurePass API
 */
export async function verifyGST(data: GSTVerifyRequest): Promise<GSTVerifyResponse> {
  if (!SUREPASS_BASE_URL) {
    throw new Error('VITE_SUREPASS_BASE_URL is not configured');
  }

  if (!SUREPASS_AUTH_TOKEN) {
    throw new Error('VITE_SUREPASS_AUTH_TOKEN is not configured');
  }

  // Remove trailing slash from base URL
  const baseUrl = SUREPASS_BASE_URL.replace(/\/+$/, '');
  const url = `${baseUrl}/api/v1/corporate/gstin`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${SUREPASS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        id_number: data.gstin.toUpperCase().trim(),
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.status === 200 && responseData.status_code === 200 && responseData.success === true) {
      return {
        success: true,
        message: 'GST verified successfully',
        data: responseData,
      };
    }

    // Handle non-200 responses
    let errorMessage = 'GST verification failed';
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error) {
      errorMessage = responseData.error;
    } else if (!response.ok) {
      errorMessage = `GST verification failed: ${response.statusText}`;
    }

    return {
      success: false,
      message: errorMessage,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify GST. Please try again.',
    };
  }
}

interface BankAccountVerifyRequest {
  account_number: string;
  ifsc_code: string;
}

interface BankAccountVerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    status_code?: number;
    success?: boolean;
    message?: string;
    [key: string]: unknown;
  };
}

/**
 * Verify Bank Account using SurePass API
 */
export async function verifyBankAccount(data: BankAccountVerifyRequest): Promise<BankAccountVerifyResponse> {
  if (!SUREPASS_BASE_URL) {
    throw new Error('VITE_SUREPASS_BASE_URL is not configured');
  }

  if (!SUREPASS_AUTH_TOKEN) {
    throw new Error('VITE_SUREPASS_AUTH_TOKEN is not configured');
  }

  // Remove trailing slash from base URL
  const baseUrl = SUREPASS_BASE_URL.replace(/\/+$/, '');
  const url = `${baseUrl}/api/v1/bank-verification/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${SUREPASS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        id_number: data.account_number.trim(),
        ifsc: data.ifsc_code.toUpperCase().trim(),
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.status === 200) {
      return {
        success: true,
        message: 'Bank account verified successfully',
        data: responseData,
      };
    }

    // Handle non-200 responses
    let errorMessage = 'Bank account verification failed';
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error) {
      errorMessage = responseData.error;
    } else if (!response.ok) {
      errorMessage = `Bank account verification failed: ${response.statusText}`;
    }

    return {
      success: false,
      message: errorMessage,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify bank account. Please try again.',
    };
  }
}

interface MSMEVerifyRequest {
  uan: string;
}

interface MSMEVerifyResponse {
  success: boolean;
  message?: string;
  data?: {
    data?: {
      uan?: string;
      main_details?: {
        name_of_enterprise?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    status_code?: number;
    success?: boolean;
    message?: string;
    message_code?: string;
  };
}

/**
 * Verify MSME/Udyam Registration Number using SurePass API
 */
export async function verifyMSME(data: MSMEVerifyRequest): Promise<MSMEVerifyResponse> {
  if (!SUREPASS_BASE_URL) {
    throw new Error('VITE_SUREPASS_BASE_URL is not configured');
  }

  if (!SUREPASS_AUTH_TOKEN) {
    throw new Error('VITE_SUREPASS_AUTH_TOKEN is not configured');
  }

  // Remove trailing slash from base URL
  const baseUrl = SUREPASS_BASE_URL.replace(/\/+$/, '');
  const url = `${baseUrl}/api/v1/corporate/udyog-aadhaar`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${SUREPASS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        id_number: data.uan.toUpperCase().trim(),
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.status === 200 && responseData.status_code === 200 && responseData.success === true) {
      return {
        success: true,
        message: 'MSME verified successfully',
        data: responseData,
      };
    }

    // Handle non-200 responses
    let errorMessage = 'MSME verification failed';
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error) {
      errorMessage = responseData.error;
    } else if (!response.ok) {
      errorMessage = `MSME verification failed: ${response.statusText}`;
    }

    return {
      success: false,
      message: errorMessage,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify MSME. Please try again.',
    };
  }
}

