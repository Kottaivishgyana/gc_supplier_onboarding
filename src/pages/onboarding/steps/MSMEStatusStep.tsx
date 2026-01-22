import { useState, useEffect, useRef, useCallback } from 'react';
import { Store, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { verifyMSME } from '@/services/surepassApi';

export function MSMEStatusStep() {
  const { formData, updateMSMEStatus, setMSMEVerificationStatus } = useOnboardingStore();
  const { msmeStatus } = formData;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const verificationTimeoutRef = useRef<number | null>(null);
  const lastVerifiedRef = useRef<string>('');

  const handleMSMENumberChange = (value: string) => {
    updateMSMEStatus({ msme_number: value.toUpperCase() });
    // Reset verification status when MSME number changes
    if (verificationStatus) {
      setVerificationStatus(null);
      setVerificationMessage('');
      setMSMEVerificationStatus(null);
    }
    lastVerifiedRef.current = '';
  };

  const performVerification = useCallback(async () => {
    // Validate MSME number before verification
    if (!msmeStatus.msme_number.trim()) {
      return;
    }

    // Create a unique key for this verification attempt
    const verificationKey = msmeStatus.msme_number;
    
    // Skip if we've already verified this exact MSME number
    if (lastVerifiedRef.current === verificationKey) {
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);
    setVerificationMessage('');
    setMSMEVerificationStatus('pending');

    try {
      const result = await verifyMSME({
        uan: msmeStatus.msme_number,
      });

      if (result.success) {
        setVerificationStatus('success');
        setVerificationMessage(result.message || 'MSME verified successfully');
        setMSMEVerificationStatus('success');
        lastVerifiedRef.current = verificationKey;
      } else {
        setVerificationStatus('error');
        setVerificationMessage(result.message || 'MSME verification failed');
        setMSMEVerificationStatus('error');
        lastVerifiedRef.current = '';
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage(error instanceof Error ? error.message : 'Failed to verify MSME. Please try again.');
      setMSMEVerificationStatus('error');
      lastVerifiedRef.current = '';
    } finally {
      setIsVerifying(false);
    }
  }, [msmeStatus.msme_number, setMSMEVerificationStatus]);

  // Auto-verify when MSME number is entered and status is yes
  useEffect(() => {
    if (msmeStatus.msme_status !== 'yes') {
      // Reset status if not yes
      setVerificationStatus((prevStatus) => {
        if (prevStatus) {
          setMSMEVerificationStatus(null);
          return null;
        }
        return prevStatus;
      });
      setVerificationMessage('');
      return;
    }

    const canVerify = msmeStatus.msme_number.trim();

    if (canVerify) {
      // Clear existing timeout
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }

      // Debounce verification by 800ms after user stops typing
      verificationTimeoutRef.current = window.setTimeout(() => {
        performVerification();
      }, 800);
    } else {
      // Reset status if MSME number is incomplete
      setVerificationStatus((prevStatus) => {
        if (prevStatus && prevStatus !== 'error') {
          setMSMEVerificationStatus(null);
          return null;
        }
        return prevStatus;
      });
      setVerificationMessage('');
    }

    return () => {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
    };
  }, [msmeStatus.msme_status, msmeStatus.msme_number, performVerification, setMSMEVerificationStatus]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">MSME Status</h1>
        <p className="text-muted-foreground">
          If your business is registered under MSME, please provide the details.
          This information helps in faster payment processing.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* MSME Registration Status */}
            <div className="flex flex-col gap-3">
              <Label>
                Are you MSME registered? <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={msmeStatus.msme_status}
                onValueChange={(value) => {
                  updateMSMEStatus({ msme_status: value as 'yes' | 'no' });
                  // Reset verification status when MSME status changes
                  if (verificationStatus) {
                    setVerificationStatus(null);
                    setVerificationMessage('');
                    setMSMEVerificationStatus(null);
                  }
                  lastVerifiedRef.current = '';
                }}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="msme_yes" />
                  <Label htmlFor="msme_yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="msme_no" />
                  <Label htmlFor="msme_no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* MSME Fields (shown only if Yes) */}
            {msmeStatus.msme_status === 'yes' && (
              <div className="flex flex-col gap-6">
                {/* Udyam Number */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="msme_number">
                    Udyam Registration Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="msme_number"
                      placeholder="UDYAM-XX-00-0000000"
                      value={msmeStatus.msme_number}
                      onChange={(e) => handleMSMENumberChange(e.target.value)}
                      className="pr-12 h-14 uppercase"
                    />
                    <Store className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Format: UDYAM-XX-00-0000000
                  </p>
                </div>

                {/* MSME Verification Status */}
                {(isVerifying || verificationStatus) && (
                  <div className="flex flex-col gap-3">
                    {isVerifying && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                        <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                        <span className="text-sm font-medium">Verifying MSME...</span>
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

                {/* MSME Certificate Upload */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="msme_document">
                    Upload MSME / Udyam Certificate
                  </Label>
                  <Input
                    id="msme_document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateMSMEStatus({ msme_document: file });
                    }}
                    className="h-14 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload PDF, JPG, or PNG file (Max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validateMSMEStatus(data: {
  msme_status: string;
  msme_number: string;
}): boolean {
  if (!data.msme_status) {
    alert('Please select MSME registration status');
    return false;
  }
  if (data.msme_status === 'yes') {
    if (!data.msme_number.trim()) {
      alert('Please enter Udyam Registration Number');
      return false;
    }
  }
  return true;
}
