import { pdf } from '@react-pdf/renderer';
import { SupplierAgreementPDF } from '@/components/SupplierAgreementPDF';
import type { OnboardingFormData } from '@/types/onboarding';
import { preloadPDFImages } from './imageLoader';

/**
 * Generate Supplier Agreement PDF as Blob
 */
async function generatePDFBlob(
  formData: OnboardingFormData,
  supplierId: string,
  docNumber?: string
): Promise<Blob> {
  const { geriCareImage } = await preloadPDFImages();

  const doc = (
    <SupplierAgreementPDF
      formData={formData}
      supplierId={supplierId}
      docNumber={docNumber}
      geriCareImageBase64={geriCareImage}
    />
  );
  return await pdf(doc).toBlob();
}

/**
 * Generate and download Supplier Agreement PDF
 */
export async function generateSupplierAgreementPDF(
  formData: OnboardingFormData,
  supplierId: string,
  docNumber?: string
): Promise<void> {
  try {
    const blob = await generatePDFBlob(formData, supplierId, docNumber);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Supplier_Agreement_${supplierId}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

/**
 * Generate Supplier Agreement PDF and return as File object (for upload)
 */
export async function generateSupplierAgreementFile(
  formData: OnboardingFormData,
  supplierId: string,
  docNumber?: string
): Promise<File> {
  const blob = await generatePDFBlob(formData, supplierId, docNumber);
  const fileName = `Supplier_Agreement_${supplierId}_${new Date().toISOString().split('T')[0]}.pdf`;
  return new File([blob], fileName, { type: 'application/pdf' });
}

