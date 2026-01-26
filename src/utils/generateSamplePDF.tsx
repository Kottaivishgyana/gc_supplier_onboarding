import { pdf } from '@react-pdf/renderer';
import { SupplierAgreementPDF } from '@/components/SupplierAgreementPDF';
import { INITIAL_FORM_DATA } from '@/types/onboarding';
import { preloadPDFImages } from './imageLoader';

/**
 * Generate a sample PDF with dummy data for testing
 * This is temporary and will be removed after testing
 */
export async function generateSamplePDF(): Promise<void> {
  try {
    // Create sample form data
    const sampleFormData = {
      ...INITIAL_FORM_DATA,
      basicInfo: {
        company_name: 'Sample Supplier Company Pvt Ltd',
        email: 'sample@supplier.com',
        phone: '9876543210',
        business_type: 'supplier',
        address: '123 Business Street, Industrial Area',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        billing_address_different: true,
        billing_address: '456 Billing Avenue, Commercial Zone',
        billing_city: 'Bangalore',
        billing_state: 'Karnataka',
        billing_pincode: '560002',
      },
      panDetails: {
        pan_number: 'ABCDE1234F',
        full_name: 'Sample Supplier Name',
        dob: '1990-01-15',
        pan_document: null,
      },
      gstInfo: {
        gst_status: 'registered' as const,
        gst_number: '29ABCDE1234F1Z5',
        gst_document: null,
      },
      bankAccount: {
        account_name: 'Sample Supplier Company',
        account_number: '1234567890123456',
        confirm_account_number: '1234567890123456',
        ifsc_code: 'SBIN0001234',
        bank_name: 'State Bank of India',
        branch_name: 'MG Road Branch',
      },
      msmeStatus: {
        msme_status: 'yes' as const,
        msme_number: 'UDYAM-KA-06-0001234',
        msme_document: null,
      },
      drugLicense: {
        drug_license_status: 'yes' as const,
        drug_license_number: 'DL-12345/2020',
        drug_license_document: null,
      },
      contactInformation: {
        transaction_name: 'John Doe',
        transaction_contact: '9876543210',
        transaction_email: 'transaction@supplier.com',
        escalation_name: 'Jane Smith',
        escalation_role: 'hod' as const,
        escalation_contact: '9876543211',
        escalation_email: 'escalation@supplier.com',
        additional_contact2_name: 'Bob Johnson',
        additional_contact2_role: 'proprietor' as const,
        additional_contact2: '9876543212',
        additional_contact2_email: 'additional@supplier.com',
      },
      commercialDetails: {
        credit_days: '45',
        delivery: 'At our works at your cost',
        discount_basis: 'PTS' as const,
        invoice_discount_type: 'On Invoice' as const,
        invoice_discount_percentage: '5',
        is_authorized_distributor: 'Yes' as const,
        authorized_distributors: [
          { manufacturer_name: 'Manufacturer A' },
          { manufacturer_name: 'Manufacturer B' },
        ],
        return_non_moving: '100',
        return_short_expiry_percentage: '50',
        return_damage_type: 'Replacement' as const,
        return_expired_percentage: '100',
      },
      termsAccepted: true,
    };

    // Preload images as base64
    const { geriCareImage } = await preloadPDFImages();

    const doc = (
      <SupplierAgreementPDF
        formData={sampleFormData}
        supplierId="SAMPLE-001"
        docNumber="GC-DOC-2024-001"
        geriCareImageBase64={geriCareImage}
      />
    );
    const blob = await pdf(doc).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sample_Supplier_Agreement_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
    console.log('Sample PDF generated successfully');
  } catch (error) {
    console.error('Error generating sample PDF:', error);
    throw new Error('Failed to generate sample PDF');
  }
}

