import { User, Building2, Hash, MapPin, Landmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function BankAccountStep() {
  const { formData, updateBankAccount } = useOnboardingStore();
  const { bankAccount } = formData;

  const handleIFSCChange = (value: string) => {
    updateBankAccount({ ifsc_code: value.toUpperCase() });
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
                  onChange={(e) =>
                    updateBankAccount({ account_number: e.target.value })
                  }
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
  if (!data.account_name.trim()) {
    alert('Please enter account holder name');
    return false;
  }
  if (!data.account_number.trim()) {
    alert('Please enter account number');
    return false;
  }
  if (data.account_number !== data.confirm_account_number) {
    alert('Account numbers do not match');
    return false;
  }
  if (!data.ifsc_code.trim() || data.ifsc_code.length !== 11) {
    alert('Please enter a valid 11-character IFSC code');
    return false;
  }
  if (!data.bank_name.trim()) {
    alert('Please enter bank name');
    return false;
  }
  if (!data.branch_name.trim()) {
    alert('Please enter branch name');
    return false;
  }
  return true;
}
