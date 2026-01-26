import { useState } from 'react';
import { Store, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { verifyMSME } from '@/services/surepassApi';

export function MSMEStatusStep() {
  const { formData, updateMSMEStatus, setMSMEVerificationStatus } = useOnboardingStore();
  const { msmeStatus } = formData;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string>('');

  const handleMSMENumberChange = (value: string) => {
    updateMSMEStatus({ msme_number: value.toUpperCase() });
  };

  const handleVerify = async () => {
    if (msmeStatus.msme_status !== 'yes') {
      alert('Please select MSME status as Yes');
      return;
    }

    // Validate MSME number before verification
    if (!msmeStatus.msme_number.trim()) {
      alert('Please enter Udyam Registration Number');
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

      console.log('MSME Verification Response:', result);

      if (result.success && result.data) {
        // Handle the response structure: result.data contains the API response
        // The API response has: { data: { main_details: {...}, enterprise_type_list: [...] }, status_code, success, ... }
        const apiResponse = result.data;
        const responseData = apiResponse.data;
        const mainDetails = responseData?.main_details;

        if (mainDetails) {
          // Construct address from available fields
          const addressParts: string[] = [];
          if (mainDetails.flat) addressParts.push(mainDetails.flat);
          if (mainDetails.name_of_building) addressParts.push(mainDetails.name_of_building);
          if (mainDetails.road) addressParts.push(mainDetails.road);
          if (mainDetails.village) addressParts.push(mainDetails.village);
          if (mainDetails.block) addressParts.push(mainDetails.block);
          if (mainDetails.city) addressParts.push(mainDetails.city);
          if (mainDetails.state) addressParts.push(mainDetails.state);
          if (mainDetails.pin) addressParts.push(mainDetails.pin);
          const address = addressParts.join(', ');

          // Extract enterprise_type_list - check both main_details and root data level
          let enterpriseTypeList: Array<{
            classification_year?: string;
            enterprise_type?: string;
            classification_date?: string;
          }> = [];
          
          if (mainDetails.enterprise_type_list && Array.isArray(mainDetails.enterprise_type_list)) {
            enterpriseTypeList = mainDetails.enterprise_type_list;
          } else if (responseData?.enterprise_type_list && Array.isArray(responseData.enterprise_type_list)) {
            enterpriseTypeList = responseData.enterprise_type_list;
          }

          console.log('Extracted enterprise_type_list:', enterpriseTypeList);

          const verificationData = {
            name_of_enterprise: mainDetails.name_of_enterprise || '',
            major_activity: mainDetails.major_activity || '',
            date_of_commencement: mainDetails.date_of_commencement || '',
            organization_type: mainDetails.organization_type || '',
            address: address || '',
            enterprise_type_list: enterpriseTypeList.map((item: {
              classification_year?: string;
              enterprise_type?: string;
              classification_date?: string;
            }) => ({
              classification_year: item.classification_year || '',
              enterprise_type: item.enterprise_type || '',
              classification_date: item.classification_date || '',
            })),
          };

          console.log('Storing MSME Verification Data:', verificationData);
          console.log('Enterprise Type List Count:', verificationData.enterprise_type_list.length);

          // Store verification data in the store
          updateMSMEStatus({
            verification_data: verificationData,
          });

          setVerificationStatus('success');
          setVerificationMessage(result.message || 'MSME verified successfully');
          setMSMEVerificationStatus('success');
        } else {
          console.error('MSME verification response missing main_details');
          setVerificationStatus('error');
          setVerificationMessage('MSME verification failed: Invalid response structure');
          setMSMEVerificationStatus('error');
        }
      } else {
        setVerificationStatus('error');
        setVerificationMessage(result.message || 'MSME verification failed');
        setMSMEVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage(error instanceof Error ? error.message : 'Failed to verify MSME. Please try again.');
      setMSMEVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

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

                {/* Verify Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleVerify} 
                    disabled={isVerifying}
                    className="gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isVerifying ? 'Verifying...' : 'Verify MSME'}
                  </Button>
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
