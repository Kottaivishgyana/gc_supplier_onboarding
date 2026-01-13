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
  country?: string;
  supplier_type?: string;
  custom_business_type?: string;
  custom_drug_license_no?: string;
  // Contact Information - Transaction
  custom_transaction_contact_name?: string;
  custom_transaction_contact?: string;
  custom_transaction_email?: string;
  // Contact Information - Escalation (Additional Communication 1)
  custom_escalation_contact_name?: string;
  custom_escalation_role?: string;
  custom_escalation_contact?: string;
  custom_escalation_email?: string;
  // Contact Information - Additional Communication 2 (maps to custom_contact_name_2, etc.)
  custom_contact_name_2?: string;
  custom_role_2?: string;
  custom_contact_2?: string;
  custom_email_2?: string;
  // Contact Information - Additional Communication 3 (Optional, maps to custom_contact_name_3, etc.)
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
  // Document attachments
  custom_pan_img?: string;
  custom_gst_img?: string;
  custom_drug_licence_img?: string; // Note: spelling is "licence"
  // Authorized distributors (Child Table)
  custom_authorized_distributors?: Array<{
    manufacturer_name: string;
    document: string; // File URL
  }>;
  // Verification Status
  custom_verification_status?: string;
  // MSME / Udyam
  custom_msme__udyam_number?: string;
  custom_msme_certificate_?: string;
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

// Request headers for file upload (multipart/form-data)
function getFileUploadHeaders(): HeadersInit {
  const headers: HeadersInit = {
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
  // Check if API credentials are configured
  if (!API_KEY || !API_SECRET) {
    throw new Error('API credentials are not configured. Please set VITE_ERPNEXT_API_KEY and VITE_ERPNEXT_API_SECRET environment variables.');
  }

  if (!API_BASE_URL) {
    throw new Error('API URL is not configured. Please set VITE_ERPNEXT_API_URL environment variable.');
  }

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
    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      throw new Error(
        `Authentication failed (401). Please verify your API credentials (VITE_ERPNEXT_API_KEY and VITE_ERPNEXT_API_SECRET) are correct and the API user has proper permissions.`
      );
    }
    
    // Try to get error message from response
    let errorMessage = `Failed to fetch supplier: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.exception || errorData.message || errorMessage;
    } catch {
      // If JSON parsing fails, use default message
    }
    
    throw new Error(errorMessage);
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
 * Link an existing Website User (portal user) to the Supplier's Portal Users child table.
 * Assumes the User (with given email) is already created by the signup process.
 */
export async function linkSupplierPortalUser(
  supplierName: string,
  userEmail: string | null | undefined
): Promise<void> {
  const email = (userEmail || '').trim();
  if (!email) return;

  try {
    // Create Portal User row linking this supplier to the existing User
    const payload = {
      doctype: 'Portal User',
      parenttype: 'Supplier',
      parentfield: 'portal_users',
      parent: supplierName,
      user: email,
    };

    const response = await fetch(`${API_BASE_URL}/api/resource/Portal User`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      // If portal user already exists, ERPNext may throw; log and continue
      console.warn('Failed to create Portal User link:', error);
    }
  } catch (error) {
    console.error('Error while linking portal user to supplier:', error);
  }
}

/**
 * Update authorized distributors child table entries
 * This function handles creating/updating child table entries for authorized distributors
 */
export async function updateAuthorizedDistributors(
  supplierName: string,
  distributors: Array<{ manufacturer_name: string; document_url: string }>
): Promise<void> {
  // First, get the current supplier to check existing child table entries
  const supplierResponse = await fetch(
    `${API_BASE_URL}/api/resource/Supplier/${encodeURIComponent(supplierName)}`,
    {
      method: 'GET',
      headers: getHeaders(),
    }
  );

  if (!supplierResponse.ok) {
    throw new Error('Failed to fetch supplier data');
  }

  const supplierData = await supplierResponse.json();
  const existingEntries = supplierData.data?.custom_authorized_distributors || [];

  // Delete existing entries if any
  for (const entry of existingEntries) {
    if (entry.name) {
      try {
        await fetch(
          `${API_BASE_URL}/api/resource/Authorized Distributor/${encodeURIComponent(entry.name)}`,
          {
            method: 'DELETE',
            headers: getHeaders(),
          }
        );
      } catch (error) {
        console.warn('Failed to delete existing authorized distributor entry:', error);
      }
    }
  }

  // Create new entries
  for (const distributor of distributors) {
    if (distributor.manufacturer_name) {
      const payload = {
        doctype: 'Authorized Distributor',
        parent: supplierName,
        parenttype: 'Supplier',
        parentfield: 'custom_authorized_distributors',
        manufacturer_name: distributor.manufacturer_name,
        document: distributor.document_url || '',
      };

      const response = await fetch(`${API_BASE_URL}/api/resource/Authorized Distributor`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`Failed to create authorized distributor entry for ${distributor.manufacturer_name}:`, error);
        // Continue with other entries even if one fails
      }
    }
  }
}

/**
 * Update bank account child table entries in Supplier
 * This function handles creating/updating child table entries for bank accounts
 */
export async function updateSupplierBankAccounts(
  supplierName: string,
  bankAccountData: {
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
    branch_name: string;
  }
): Promise<void> {
  // First, get the current supplier to check existing child table entries
  const supplierResponse = await fetch(
    `${API_BASE_URL}/api/resource/Supplier/${encodeURIComponent(supplierName)}`,
    {
      method: 'GET',
      headers: getHeaders(),
    }
  );

  if (!supplierResponse.ok) {
    throw new Error('Failed to fetch supplier data');
  }

  const supplierData = await supplierResponse.json();
  const existingEntries = supplierData.data?.custom_bank_account_details || [];

  // Delete existing entries if any
  for (const entry of existingEntries) {
    if (entry.name) {
      try {
        await fetch(
          `${API_BASE_URL}/api/resource/Supplier Bank Account/${encodeURIComponent(entry.name)}`,
          {
            method: 'DELETE',
            headers: getHeaders(),
          }
        );
      } catch (error) {
        console.warn('Failed to delete existing bank account entry:', error);
      }
    }
  }

  // Create new bank account entry
  const payload = {
    doctype: 'Supplier Bank Account',
    parent: supplierName,
    parenttype: 'Supplier',
    parentfield: 'custom_bank_account_details',
    account_holder_name: bankAccountData.account_holder_name,
    account_number: bankAccountData.account_number,
    ifsc_code: bankAccountData.ifsc_code.toUpperCase(),
    bank_name: bankAccountData.bank_name,
    branch_name: bankAccountData.branch_name,
  };

  const response = await fetch(`${API_BASE_URL}/api/resource/Supplier Bank Account`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.exception || `Failed to create bank account entry: ${response.statusText}`);
  }
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
  },
  addressType: 'Billing' | 'Shipping' = 'Billing',
  isPrimary: boolean = true
): Promise<void> {
  const payload: AddressPayload = {
    doctype: 'Address',
    address_title: `${supplierName}-${addressType}`,
    address_type: addressType,
    address_line1: addressData.address_line1,
    city: addressData.city,
    state: addressData.state,
    country: 'India',
    pincode: addressData.pincode,
    is_primary_address: isPrimary ? 1 : 0,
    is_shipping_address: addressType === 'Shipping' ? 1 : 0,
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
 * Upload file to ERPNext
 */
export async function uploadFile(
  file: File,
  supplierName: string,
  folder: string = 'Home/Attachments',
  isPrivate: number = 0
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  formData.append('is_private', isPrivate.toString());
  formData.append('doctype', 'Supplier');
  formData.append('docname', supplierName);

  const response = await fetch(`${API_BASE_URL}/api/method/upload_file`, {
    method: 'POST',
    headers: getFileUploadHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.exc || `Failed to upload file: ${response.statusText}`);
  }

  const result = await response.json();
  // ERPNext returns file URL in the message
  // Format: /files/filename.pdf
  return result.message?.file_url || result.message?.file_name || '';
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
    };
    panDetails: {
      pan_number: string;
      pan_document?: File | null;
    };
    gstInfo: {
      gst_status: string;
      gst_number: string;
      gst_document?: File | null;
    };
    bankAccount: {
      account_name: string;
      account_number: string;
      ifsc_code: string;
      bank_name: string;
      branch_name: string;
    };
    drugLicense?: {
      drug_license_number: string;
      drug_license_document?: File | null;
    };
    msmeStatus?: {
      msme_status: string;
      msme_number: string;
      msme_document?: File | null;
    };
    contactInformation?: {
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
      additional_contact_role?: 'hod' | 'proprietor' | 'head' | '';
      additional_contact?: string;
      additional_contact_email?: string;
    };
    commercialDetails?: {
      credit_days: string;
      delivery: string;
      discount_basis: 'PTS' | 'PTR' | 'MRP' | '';
      invoice_discount_type: 'On Invoice' | 'Off Invoice' | '';
      invoice_discount_percentage: string;
      is_authorized_distributor: 'Yes' | 'No' | '';
      authorized_distributors?: Array<{
        manufacturer_name: string;
        document?: File | null;
      }>;
      return_non_moving: string;
      return_short_expiry_percentage: string;
      return_damage_type: 'Replacement' | '100% CN' | '';
      return_expired_percentage: string;
    };
  }
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Upload files first and get their URLs
    const fileUploads: { [key: string]: string } = {};

    if (formData.panDetails.pan_document) {
      try {
        const panFileUrl = await uploadFile(formData.panDetails.pan_document, supplierName, 'Home/Attachments');
        fileUploads.pan_document = panFileUrl;
      } catch (error) {
        console.error('Failed to upload PAN document:', error);
        // Continue with submission even if file upload fails
      }
    }

    if (formData.gstInfo.gst_status === 'registered' && formData.gstInfo.gst_document) {
      try {
        const gstFileUrl = await uploadFile(formData.gstInfo.gst_document, supplierName, 'Home/Attachments');
        fileUploads.gst_document = gstFileUrl;
      } catch (error) {
        console.error('Failed to upload GST document:', error);
      }
    }

    if (formData.drugLicense?.drug_license_document) {
      try {
        const drugFileUrl = await uploadFile(formData.drugLicense.drug_license_document, supplierName, 'Home/Attachments');
        fileUploads.drug_license_document = drugFileUrl;
      } catch (error) {
        console.error('Failed to upload drug license document:', error);
      }
    }

    // Upload MSME / Udyam certificate
    if (formData.msmeStatus?.msme_document) {
      try {
        const msmeFileUrl = await uploadFile(formData.msmeStatus.msme_document, supplierName, 'Home/Attachments');
        fileUploads.msme_document = msmeFileUrl;
      } catch (error) {
        console.error('Failed to upload MSME document:', error);
      }
    }

    // Upload authorized distributor documents
    const authorizedDistributorData: Array<{ manufacturer_name: string; document_url: string }> = [];
    if (formData.commercialDetails?.is_authorized_distributor === 'Yes' && formData.commercialDetails.authorized_distributors) {
      for (let i = 0; i < formData.commercialDetails.authorized_distributors.length; i++) {
        const item = formData.commercialDetails.authorized_distributors[i];
        if (item.document) {
          try {
            const fileUrl = await uploadFile(
              item.document, 
              supplierName, 
              'Home/Attachments'
            );
            authorizedDistributorData.push({
              manufacturer_name: item.manufacturer_name,
              document_url: fileUrl
            });
          } catch (error) {
            console.error(`Failed to upload authorized distributor document for ${item.manufacturer_name}:`, error);
            // Still add the manufacturer name even if file upload fails
            authorizedDistributorData.push({
              manufacturer_name: item.manufacturer_name,
              document_url: ''
            });
          }
        }
      }
    }

    // 2. Update supplier main document with all form data
    const supplierPayload: SupplierUpdatePayload = {
      supplier_name: formData.basicInfo.company_name,
      email_id: formData.basicInfo.email,
      mobile_no: formData.basicInfo.phone,
      pan: formData.panDetails.pan_number,
      gstin: formData.gstInfo.gst_status === 'registered' ? formData.gstInfo.gst_number : '',
      gst_category: formData.gstInfo.gst_status === 'registered' ? 'Registered Regular' : 'Unregistered',
      country: 'India',
      supplier_type: formData.basicInfo.business_type === 'supplier' ? 'Company' : 'Individual',
      ...(formData.basicInfo.business_type && {
        custom_business_type: formData.basicInfo.business_type,
      }),
      ...(formData.drugLicense?.drug_license_number && {
        custom_drug_license_no: formData.drugLicense.drug_license_number,
      }),
      // MSME / Udyam
      ...(formData.msmeStatus && formData.msmeStatus.msme_status === 'yes' && {
        custom_msme__udyam_number: formData.msmeStatus.msme_number || '',
      }),
      // Contact Information - Transaction
      ...(formData.contactInformation && {
        custom_transaction_contact_name: formData.contactInformation.transaction_name,
        custom_transaction_contact: formData.contactInformation.transaction_contact,
        custom_transaction_email: formData.contactInformation.transaction_email,
        // Contact Information - Additional Communication 1 (Escalation)
        custom_escalation_contact_name: formData.contactInformation.escalation_name,
        custom_escalation_role: formData.contactInformation.escalation_role,
        custom_escalation_contact: formData.contactInformation.escalation_contact,
        custom_escalation_email: formData.contactInformation.escalation_email,
        // Contact Information - Additional Communication 2 → custom_contact_*_2
        custom_contact_name_2: formData.contactInformation.additional_contact2_name,
        custom_role_2: formData.contactInformation.additional_contact2_role,
        custom_contact_2: formData.contactInformation.additional_contact2,
        custom_email_2: formData.contactInformation.additional_contact2_email,
        // Contact Information - Additional Communication 3 (Optional) → custom_contact_*_3
        ...(formData.contactInformation.additional_contact_name && {
          custom_contact_name_3: formData.contactInformation.additional_contact_name,
          custom_role_3: formData.contactInformation.additional_contact_role,
          custom_contact_3: formData.contactInformation.additional_contact,
          custom_email_3: formData.contactInformation.additional_contact_email,
        }),
      }),
      // Commercial Details
      ...(formData.commercialDetails && {
        custom_credit_days_from_delivery_date: formData.commercialDetails.credit_days,
        custom_delivery: formData.commercialDetails.delivery,
        custom_discount_: formData.commercialDetails.discount_basis,
        custom_invoice_discount_type: formData.commercialDetails.invoice_discount_type,
        custom_invoice_discount_: formData.commercialDetails.invoice_discount_percentage ? parseFloat(formData.commercialDetails.invoice_discount_percentage) : 0,
        custom_manufacturers_authorized_distributor: formData.commercialDetails.is_authorized_distributor,
        custom_return_policy__non_moving: formData.commercialDetails.return_non_moving,
        custom_return_policy__short_expiry_less_than_90_days_: formData.commercialDetails.return_short_expiry_percentage ? parseFloat(formData.commercialDetails.return_short_expiry_percentage) : 0,
        custom_return_policy__damage: formData.commercialDetails.return_damage_type,
        custom_return_policy__expired_: formData.commercialDetails.return_expired_percentage ? parseFloat(formData.commercialDetails.return_expired_percentage) : 0,
      }),
      // Document attachments
      ...(fileUploads.pan_document && {
        custom_pan_img: fileUploads.pan_document,
      }),
      ...(fileUploads.gst_document && {
        custom_gst_img: fileUploads.gst_document,
      }),
      ...(fileUploads.drug_license_document && {
        custom_drug_licence_img: fileUploads.drug_license_document,
      }),
      ...(fileUploads.msme_document && {
        custom_msme_certificate_: fileUploads.msme_document,
      }),
      // Set verification status to "Pending for verification" when form is submitted
      custom_verification_status: 'Pending for verification',
    };

    await updateSupplier(supplierName, supplierPayload);

    // 3. Ensure portal user link is created for this supplier
    // Use the basic info email (same as signup email) as the portal user id
    try {
      await linkSupplierPortalUser(supplierName, formData.basicInfo.email);
    } catch (error) {
      console.error('Failed to link portal user for supplier:', error);
    }

    // 4. Update authorized distributors child table if applicable
    if (formData.commercialDetails?.is_authorized_distributor === 'Yes' && authorizedDistributorData.length > 0) {
      try {
        await updateAuthorizedDistributors(supplierName, authorizedDistributorData);
      } catch (error) {
        console.error('Failed to update authorized distributors:', error);
        // Continue with submission even if child table update fails
      }
    } else if (formData.commercialDetails?.is_authorized_distributor === 'No') {
      // 5. Clear existing entries if user selected "No"
      try {
        await updateAuthorizedDistributors(supplierName, []);
      } catch (error) {
        console.error('Failed to clear authorized distributors:', error);
      }
    }

    // 3. Create registered address (always created as primary)
    await createAddress(
      supplierName,
      {
        address_line1: formData.basicInfo.address,
        city: formData.basicInfo.city,
        state: formData.basicInfo.state,
        pincode: formData.basicInfo.pincode,
      },
      'Billing',
      true
    );

    // 4. Create billing address if different from registered address
    if (formData.basicInfo.billing_address_different) {
      await createAddress(
        supplierName,
        {
          address_line1: formData.basicInfo.billing_address,
          city: formData.basicInfo.billing_city,
          state: formData.basicInfo.billing_state,
          pincode: formData.basicInfo.billing_pincode,
        },
        'Billing',
        false
      );
    }

    // 5. Create bank account (separate Bank Account doctype for ERPNext accounting)
    try {
      await createBankAccount(supplierName, formData.bankAccount);
    } catch (error) {
      console.error('Failed to create Bank Account doctype:', error);
      // Continue even if this fails
    }

    // 6. Update bank account child table in Supplier
    try {
      await updateSupplierBankAccounts(supplierName, {
        account_holder_name: formData.bankAccount.account_name,
        account_number: formData.bankAccount.account_number,
        ifsc_code: formData.bankAccount.ifsc_code,
        bank_name: formData.bankAccount.bank_name,
        branch_name: formData.bankAccount.branch_name,
      });
    } catch (error) {
      console.error('Failed to update bank account child table:', error);
      // Continue even if this fails
    }

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
 * Check if a user exists in Frappe ERPNext
 * Returns true if user exists, false otherwise
 * Directly queries user by email in URL path for fastest response
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    // Use the same API credentials for authentication
    if (!API_KEY || !API_SECRET) {
      console.warn('API credentials not configured for user check');
      return false;
    }

    if (!API_BASE_URL) {
      console.warn('API URL not configured for user check');
      return false;
    }

    // Query user directly by email in URL path - fastest method
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(
      `${API_BASE_URL}/api/resource/User/${encodedEmail}`,
      {
        method: 'GET',
        headers: getHeaders(),
        mode: 'cors',
        credentials: 'omit',

      }
    );

    // 200 OK means user exists, 404 means user doesn't exist
    if (response.status === 200) {
      return true;
    } else if (response.status === 404) {
      return false;
    } else {
      // Other status codes - log and assume user doesn't exist
      console.warn('Failed to check user existence:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    // On error, assume user doesn't exist to allow signup
    return false;
  }
}

/**
 * Create a new user in Frappe ERPNext
 */
interface CreateUserPayload {
  email: string;
  first_name: string;
  last_name: string;
  new_password: string;
  send_welcome_email: number;
  enabled: number;
  roles: { role: string }[];
}

export async function createUser(
  payload: CreateUserPayload
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if API credentials are configured
    if (!API_KEY || !API_SECRET) {
      return {
        success: false,
        message: 'API credentials are not configured. Please set VITE_ERPNEXT_API_KEY and VITE_ERPNEXT_API_SECRET environment variables.',
      };
    }

    if (!API_BASE_URL) {
      return {
        success: false,
        message: 'API URL is not configured. Please set VITE_ERPNEXT_API_URL environment variable.',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/resource/User`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed (401). Please verify your API credentials (VITE_ERPNEXT_API_KEY and VITE_ERPNEXT_API_SECRET) are correct and the API user has proper permissions.',
        };
      }

      // Try to get error message from response
      let errorMessage = `Failed to create user: ${response.statusText}`;
      try {
        const error = await response.json();
        errorMessage = error.exception || error.message || errorMessage;
      } catch {
        // If JSON parsing fails, use default message
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: true,
      message: 'User created successfully',
    };
  } catch (error) {
    console.error('User creation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create user',
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

