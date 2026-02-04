import { useState } from 'react';
import { User, Building2, Hash, MapPin, Landmark, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { message } from 'antd';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { verifyBankAccount } from '@/services/surepassApi';

export function BankAccountStep() {
  const { formData, updateBankAccount, setBankVerificationStatus } = useOnboardingStore();
  const { bankAccount } = formData;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string>('');

  const handleIFSCChange = (value: string) => {
    updateBankAccount({ ifsc_code: value.toUpperCase() });
  };

  const handleAccountNumberChange = (value: string) => {
    updateBankAccount({ account_number: value });
  };

  const handleVerify = async () => {
    // Validate fields before verification
    message.destroy();
    if (!bankAccount.account_number.trim()) {
      message.error({ content: 'Please enter account number', key: 'validation-error' });
      return;
    }

    if (!bankAccount.ifsc_code.trim() || bankAccount.ifsc_code.length !== 11) {
      message.error({ content: 'Please enter a valid 11-character IFSC code', key: 'validation-error' });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);
    setVerificationMessage('');
    setBankVerificationStatus('pending');

    try {
      const result = await verifyBankAccount({
        account_number: bankAccount.account_number,
        ifsc_code: bankAccount.ifsc_code,
      });

      if (result.success && result.data) {
        // Extract bank details from response
        // Response structure: result.data.data.ifsc_details
        const responseData = result.data.data as { 
          ifsc_details?: { 
            micr?: string;
            bank_name?: string;
            branch?: string;
          } 
        } | undefined;
        
        const ifscDetails = responseData?.ifsc_details;
        
        // Update bank account fields with verified data
        const updates: { micr?: string; bank_name?: string; branch_name?: string } = {};
        
        if (ifscDetails?.micr) {
          updates.micr = ifscDetails.micr;
        }
        
        if (ifscDetails?.bank_name) {
          updates.bank_name = ifscDetails.bank_name;
        }
        
        if (ifscDetails?.branch) {
          updates.branch_name = ifscDetails.branch;
        }
        
        // Update bank account with extracted data
        if (Object.keys(updates).length > 0) {
          updateBankAccount(updates);
        }

        setVerificationStatus('success');
        setVerificationMessage(result.message || 'Bank account verified successfully');
        setBankVerificationStatus('success');
      } else {
        setVerificationStatus('error');
        setVerificationMessage(result.message || 'Bank account verification failed');
        setBankVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage(error instanceof Error ? error.message : 'Failed to verify bank account. Please try again.');
      setBankVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bank Account Details</h1>
        <p className="text-muted-foreground">
          Provide your bank account information for payment processing.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Account Holder Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="account_name">
                Account Holder Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="account_name"
                  placeholder="Enter account holder name"
                  value={bankAccount.account_name}
                  onChange={(e) =>
                    updateBankAccount({ account_name: e.target.value })
                  }
                  className="pr-12 h-14"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Account Number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="account_number">
                Account Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="account_number"
                  placeholder="Enter bank account number"
                  value={bankAccount.account_number}
                  onChange={(e) => handleAccountNumberChange(e.target.value)}
                  className="pr-12 h-14"
                />
                <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Confirm Account Number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm_account_number">
                Confirm Account Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirm_account_number"
                  placeholder="Re-enter bank account number"
                  value={bankAccount.confirm_account_number}
                  onChange={(e) =>
                    updateBankAccount({ confirm_account_number: e.target.value })
                  }
                  className="pr-12 h-14"
                />
                <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* IFSC Code */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="ifsc_code">
                IFSC Code <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="ifsc_code"
                  placeholder="SBIN0001234"
                  value={bankAccount.ifsc_code}
                  onChange={(e) => handleIFSCChange(e.target.value)}
                  maxLength={11}
                  className="pr-12 h-14 uppercase"
                />
                <Hash className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-sm text-muted-foreground">
                11-character IFSC code (e.g., SBIN0001234)
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
                {isVerifying ? 'Verifying...' : 'Verify Bank Account'}
              </Button>
            </div>

            {/* Bank Account Verification Status */}
            {(isVerifying || verificationStatus) && (
              <div className="flex flex-col gap-3">
                {isVerifying && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                    <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                    <span className="text-sm font-medium">Verifying bank account...</span>
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

            {/* Bank Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="bank_name">
                Bank Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="bank_name"
                  placeholder="Enter bank name"
                  value={bankAccount.bank_name}
                  onChange={(e) =>
                    updateBankAccount({ bank_name: e.target.value })
                  }
                  className="pr-12 h-14"
                />
                <Landmark className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Branch Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="branch_name">
                Branch Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="branch_name"
                  placeholder="Enter branch name"
                  value={bankAccount.branch_name}
                  onChange={(e) =>
                    updateBankAccount({ branch_name: e.target.value })
                  }
                  className="pr-12 h-14"
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validateBankAccount(data: {
  account_name: string;
  account_number: string;
  confirm_account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
}): boolean {
  // Destroy previous messages to show only one error at a time
  message.destroy();
  
  if (!data.account_name.trim()) {
    message.error({ content: 'Please enter account holder name', key: 'validation-error' });
    return false;
  }
  if (!data.account_number.trim()) {
    message.error({ content: 'Please enter account number', key: 'validation-error' });
    return false;
  }
  if (data.account_number !== data.confirm_account_number) {
    message.error({ content: 'Account numbers do not match', key: 'validation-error' });
    return false;
  }
  if (!data.ifsc_code.trim() || data.ifsc_code.length !== 11) {
    message.error({ content: 'Please enter a valid 11-character IFSC code', key: 'validation-error' });
    return false;
  }
  if (!data.bank_name.trim()) {
    message.error({ content: 'Please enter bank name', key: 'validation-error' });
    return false;
  }
  if (!data.branch_name.trim()) {
    message.error({ content: 'Please enter branch name', key: 'validation-error' });
    return false;
  }
  return true;
}
