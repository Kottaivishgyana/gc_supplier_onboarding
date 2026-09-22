/**
 * SurePass API Service for PAN, GST, Bank Account, and MSME Verification
 * Calls are proxied through Vercel serverless functions to keep tokens server-side.
 */

interface PANVerifyRequest {
  pan_number: string;
}

interface PANComprehensiveResponse {
  success: boolean;
  message?: string;
  data?: {
    data?: {
      client_id?: string;
      pan_number?: string;
      full_name?: string;
      full_name_split?: string[];
      masked_aadhaar?: string;
      address?: {
        line_1?: string;
        line_2?: string;
        street_name?: string;
        zip?: string;
        city?: string;
        state?: string;
        country?: string;
        full?: string;
      };
      email?: string | null;
      phone_number?: string | null;
      gender?: string;
      dob?: string;
      input_dob?: string | null;
      aadhaar_linked?: boolean;
      dob_verified?: boolean;
      dob_check?: boolean;
      category?: string;
      status?: string;
      less_info?: boolean;
      [key: string]: unknown;
    };
    status_code?: number;
    success?: boolean;
    message?: string;
    message_code?: string;
  };
}

interface PANVerifyResponse {
  success: boolean;
  message?: string;
  data?: PANComprehensiveResponse['data'];
}

/**
 * Verify PAN details via serverless proxy
 */
export async function verifyPAN(data: PANVerifyRequest): Promise<PANVerifyResponse> {
  try {
    const response = await fetch('/api/surepass-pan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id_number: data.pan_number.toUpperCase().trim(),
        get_address: true,
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
      message: error instanceof Error ? error.message : 'Failed to verify PAN. Please try again.'
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
 * Verify GSTIN via serverless proxy
 */
export async function verifyGST(data: GSTVerifyRequest): Promise<GSTVerifyResponse> {
  try {
    const response = await fetch('/api/surepass-gst', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
    data?: {
      ifsc_details?: {
        micr?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

/**
 * Verify Bank Account via serverless proxy
 */
export async function verifyBankAccount(data: BankAccountVerifyRequest): Promise<BankAccountVerifyResponse> {
  try {
    const response = await fetch('/api/surepass-bank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id_number: data.account_number.trim(),
        ifsc: data.ifsc_code.toUpperCase().trim(),
        ifsc_details: true,
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
        major_activity?: string;
        date_of_commencement?: string;
        organization_type?: string;
        flat?: string;
        name_of_building?: string;
        road?: string;
        village?: string;
        block?: string;
        city?: string;
        state?: string;
        pin?: string;
        enterprise_type_list?: Array<{
          classification_year?: string;
          enterprise_type?: string;
          classification_date?: string;
        }>;
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
 * Verify MSME/Udyam Registration Number via serverless proxy
 */
export async function verifyMSME(data: MSMEVerifyRequest): Promise<MSMEVerifyResponse> {
  try {
    const response = await fetch('/api/surepass-msme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
    if (error instanceof Error) {
      if (error.name === 'AbortError' ||
          error.message.includes('timeout') ||
          error.message.includes('aborted') ||
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

