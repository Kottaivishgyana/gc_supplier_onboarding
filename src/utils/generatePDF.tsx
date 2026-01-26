import { pdf } from '@react-pdf/renderer';
import { SupplierAgreementPDF } from '@/components/SupplierAgreementPDF';
import type { OnboardingFormData } from '@/types/onboarding';
import { preloadPDFImages } from './imageLoader';

/**
 * Generate and download Supplier Agreement PDF
 */
export async function generateSupplierAgreementPDF(
  formData: OnboardingFormData,
  supplierId: string,
  docNumber?: string
): Promise<void> {
  try {
    // Preload images as base64
    const { geriCareImage } = await preloadPDFImages();
    
    const doc = (
      <SupplierAgreementPDF 
        formData={formData} 
        supplierId={supplierId} 
        docNumber={docNumber}
        geriCareImageBase64={geriCareImage}
      />
    );
    const blob = await pdf(doc).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Supplier_Agreement_${supplierId}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

