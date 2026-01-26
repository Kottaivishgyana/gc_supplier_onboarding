import { useState } from 'react';
import { CreditCard, Upload, X, FileText, User, CalendarDays, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { verifyPAN } from '@/services/surepassApi';

export function PANDetailsStep() {
  const { formData, updatePANDetails, setPANVerificationStatus } = useOnboardingStore();
  const { panDetails, basicInfo } = formData;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string>('');

  // Determine if business type is Company or Individual
  const isCompany = basicInfo.business_type === 'Supplier' || basicInfo.business_type === 'supplier';
  const panLabel = isCompany ? 'PAN Number (Company)' : 'PAN Number (Individual)';

  const handlePANChange = (value: string) => {
    updatePANDetails({ pan_number: value.toUpperCase() });
  };

  const handleVerify = async () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Validate fields before verification
    if (!panDetails.pan_number.trim()) {
      alert('Please enter PAN number');
      return;
    }

    if (!panRegex.test(panDetails.pan_number)) {
      alert('Please enter a valid PAN number (e.g., ABCDE1234F)');
      return;
    }

    if (!panDetails.full_name.trim()) {
      alert('Please enter full name (as per PAN)');
      return;
    }

    if (!panDetails.dob) {
      alert('Please select date of birth');
      return;
    }

    if (!dobRegex.test(panDetails.dob)) {
      alert('Please enter date of birth in YYYY-MM-DD format');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);
    setVerificationMessage('');
    setPANVerificationStatus('pending');

    try {
      const result = await verifyPAN({
        pan_number: panDetails.pan_number,
        full_name: panDetails.full_name,
        dob: panDetails.dob,
      });

      if (result.success) {
        setVerificationStatus('success');
        setVerificationMessage(result.message || 'PAN verified successfully');
        setPANVerificationStatus('success');
      } else {
        setVerificationStatus('error');
        setVerificationMessage(result.message || 'PAN verification failed');
        setPANVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage(error instanceof Error ? error.message : 'Failed to verify PAN. Please try again.');
      setPANVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">PAN Details</h1>
        <p className="text-muted-foreground">
          Enter your Permanent Account Number (PAN) for tax verification.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* PAN Number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="pan_number">
                {panLabel} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="pan_number"
                  placeholder="ABCDE1234F"
                  value={panDetails.pan_number}
                  onChange={(e) => handlePANChange(e.target.value)}
                  maxLength={10}
                  className="pr-12 h-14 uppercase"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-sm text-muted-foreground">
                Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
              </p>
            </div>

            {/* Full Name (as per PAN) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="pan_full_name">
                Full Name (as per PAN) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="pan_full_name"
                  placeholder="Enter full name"
                  value={panDetails.full_name}
                  onChange={(e) => {
                    updatePANDetails({ full_name: e.target.value });
                  }}
                  className="pr-12 h-14"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="pan_dob">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="pan_dob"
                  type="date"
                  value={panDetails.dob}
                  onChange={(e) => {
                    updatePANDetails({ dob: e.target.value });
                  }}
                  className="pr-12 h-14"
                />
                <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Verify Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying}
                className="gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {isVerifying ? 'Verifying...' : 'Verify PAN'}
              </Button>
            </div>

            {/* PAN Verification Status */}
            {(isVerifying || verificationStatus) && (
              <div className="flex flex-col gap-3">
                {isVerifying && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                    <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                    <span className="text-sm font-medium">Verifying PAN...</span>
                  </div>
                )}

                {verificationStatus && !isVerifying && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      verificationStatus === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {verificationStatus === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{verificationMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* PAN Document Upload */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="pan_document">
                Upload PAN Document <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-col gap-3">
                {panDetails.pan_document ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{panDetails.pan_document.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(panDetails.pan_document.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePANDetails({ pan_document: null })}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="pan_document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updatePANDetails({ pan_document: file });
                        }
                      }}
                      className="h-14 cursor-pointer"
                    />
                    <Upload className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload PDF, JPG, or PNG file (Max 5MB)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function validatePANDetails(data: {
  pan_number: string;
  full_name: string;
  dob: string;
  pan_document?: File | null;
}): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!data.pan_number.trim()) {
    alert('Please enter PAN number');
    return false;
  }
  if (!panRegex.test(data.pan_number)) {
    alert('Please enter a valid PAN number (e.g., ABCDE1234F)');
    return false;
  }
  if (!data.full_name.trim()) {
    alert('Please enter full name (as per PAN)');
    return false;
  }
  if (!data.dob) {
    alert('Please select date of birth');
    return false;
  }
  if (!dobRegex.test(data.dob)) {
    alert('Please enter date of birth in YYYY-MM-DD format (e.g., 2003-03-13)');
    return false;
  }
  if (!data.pan_document) {
    alert('Please upload PAN document');
    return false;
  }
  if (data.pan_document.size > 5 * 1024 * 1024) {
    alert('PAN document size should be less than 5MB');
    return false;
  }
  return true;
}
