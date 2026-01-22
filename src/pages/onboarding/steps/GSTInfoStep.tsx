import { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { verifyGST } from '@/services/surepassApi';

export function GSTInfoStep() {
  const { formData, updateGSTInfo, setGSTVerificationStatus } = useOnboardingStore();
  const { gstInfo } = formData;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const verificationTimeoutRef = useRef<number | null>(null);
  const lastVerifiedRef = useRef<string>('');

  const handleGSTNumberChange = (value: string) => {
    updateGSTInfo({ gst_number: value.toUpperCase() });
    // Reset verification status when GST number changes
    if (verificationStatus) {
      setVerificationStatus(null);
      setVerificationMessage('');
      setGSTVerificationStatus(null);
    }
    lastVerifiedRef.current = '';
  };

  const performVerification = useCallback(async () => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    // Validate GST number before verification
    if (!gstInfo.gst_number.trim()) {
      return;
    }

    if (gstInfo.gst_number.length !== 15) {
      return;
    }

    if (!gstRegex.test(gstInfo.gst_number)) {
      return;
    }

    // Create a unique key for this verification attempt
    const verificationKey = gstInfo.gst_number;
    
    // Skip if we've already verified this exact GST number
    if (lastVerifiedRef.current === verificationKey) {
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);
    setVerificationMessage('');
    setGSTVerificationStatus('pending');

    try {
      const result = await verifyGST({
        gstin: gstInfo.gst_number,
      });

      if (result.success) {
        setVerificationStatus('success');
        setVerificationMessage(result.message || 'GST verified successfully');
        setGSTVerificationStatus('success');
        lastVerifiedRef.current = verificationKey;
      } else {
        setVerificationStatus('error');
        setVerificationMessage(result.message || 'GST verification failed');
        setGSTVerificationStatus('error');
        lastVerifiedRef.current = '';
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage(error instanceof Error ? error.message : 'Failed to verify GST. Please try again.');
      setGSTVerificationStatus('error');
      lastVerifiedRef.current = '';
    } finally {
      setIsVerifying(false);
    }
  }, [gstInfo.gst_number, setGSTVerificationStatus]);

  // Auto-verify when GST number is entered and status is registered
  useEffect(() => {
    if (gstInfo.gst_status !== 'registered') {
      // Reset status if not registered
      setVerificationStatus((prevStatus) => {
        if (prevStatus) {
          setGSTVerificationStatus(null);
          return null;
        }
        return prevStatus;
      });
      setVerificationMessage('');
      return;
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    const canVerify = 
      gstInfo.gst_number.trim() &&
      gstInfo.gst_number.length === 15 &&
      gstRegex.test(gstInfo.gst_number);

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
      // Reset status if GST number is incomplete
      setVerificationStatus((prevStatus) => {
        if (prevStatus && prevStatus !== 'error') {
          setGSTVerificationStatus(null);
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
  }, [gstInfo.gst_status, gstInfo.gst_number, performVerification, setGSTVerificationStatus]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">GST Information</h1>
        <p className="text-muted-foreground">
          Provide your GST registration details for invoice verification.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* GST Registration Status */}
            <div className="flex flex-col gap-3">
              <Label>
                GST Registration Status <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={gstInfo.gst_status}
                onValueChange={(value) => {
                  updateGSTInfo({ gst_status: value as 'registered' | 'not_registered' });
                  // Reset verification status when GST status changes
                  if (verificationStatus) {
                    setVerificationStatus(null);
                    setVerificationMessage('');
                    setGSTVerificationStatus(null);
                  }
                  lastVerifiedRef.current = '';
                }}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="registered" id="gst_registered" />
                  <Label htmlFor="gst_registered" className="font-normal cursor-pointer">
                    Registered
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="not_registered" id="gst_not_registered" />
                  <Label htmlFor="gst_not_registered" className="font-normal cursor-pointer">
                    Not Registered
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* GST Number (shown only if registered) */}
            {gstInfo.gst_status === 'registered' && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="gst_number">
                    GSTIN <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="gst_number"
                      placeholder="22AAAAA0000A1Z5"
                      value={gstInfo.gst_number}
                      onChange={(e) => handleGSTNumberChange(e.target.value)}
                      maxLength={15}
                      className="pr-12 h-14 uppercase"
                    />
                    <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    15-character GST Identification Number
                  </p>
                </div>

                {/* GST Verification Status */}
                {(isVerifying || verificationStatus) && (
                  <div className="flex flex-col gap-3">
                    {isVerifying && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                        <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                        <span className="text-sm font-medium">Verifying GST...</span>
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

                {/* GST Document Upload */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="gst_document">
                    Upload GST Certificate <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-col gap-3">
                    {gstInfo.gst_document ? (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{gstInfo.gst_document.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(gstInfo.gst_document.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateGSTInfo({ gst_document: null })}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          id="gst_document"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateGSTInfo({ gst_document: file });
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
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validateGSTInfo(data: {
  gst_status: string;
  gst_number: string;
  gst_document?: File | null;
}): boolean {
  if (!data.gst_status) {
    alert('Please select GST registration status');
    return false;
  }
  if (data.gst_status === 'registered') {
    if (!data.gst_number.trim()) {
      alert('Please enter GSTIN');
      return false;
    }
    if (data.gst_number.length !== 15) {
      alert('GSTIN must be 15 characters');
      return false;
    }
    if (!data.gst_document) {
      alert('Please upload GST certificate');
      return false;
    }
    if (data.gst_document.size > 5 * 1024 * 1024) {
      alert('GST document size should be less than 5MB');
      return false;
    }
  }
  return true;
}
