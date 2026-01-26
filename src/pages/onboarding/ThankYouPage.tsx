import { useState } from 'react';
import { CheckCircle2, Download, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { generateSupplierAgreementPDF } from '@/utils/generatePDF';

export function ThankYouPage() {
  const { formData, supplierId } = useOnboardingStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    if (!supplierId) {
      setDownloadError('Supplier ID not found. Please contact support.');
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      await generateSupplierAgreementPDF(formData, supplierId);
    } catch (error) {
      console.error('PDF generation error:', error);
      setDownloadError('Failed to generate PDF. Please contact support.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 px-8">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Thank You!</h1>
              <p className="text-lg text-muted-foreground">
                Your onboarding application has been submitted successfully
              </p>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-3 max-w-md">
              <p className="text-muted-foreground">
                Our team will review your documents and get back to you within 3-5 business days.
              </p>
              <p className="text-sm text-muted-foreground">
                You can download a copy of your supplier agreement for your records.
              </p>
            </div>

            {/* Download Button */}
            <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                size="lg"
                className="w-full gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Supplier Agreement PDF
                  </>
                )}
              </Button>

              {downloadError && (
                <p className="text-sm text-destructive text-center">{downloadError}</p>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t w-full">
              <p className="text-sm text-muted-foreground">
                If you have any questions or need assistance, please contact our support team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

