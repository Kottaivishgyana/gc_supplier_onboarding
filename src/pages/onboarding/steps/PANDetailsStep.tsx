import { CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function PANDetailsStep() {
  const { formData, updatePANDetails } = useOnboardingStore();
  const { panDetails } = formData;

  const handlePANChange = (value: string) => {
    updatePANDetails({ pan_number: value.toUpperCase() });
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
                PAN Number <span className="text-destructive">*</span>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validatePANDetails(data: {
  pan_number: string;
}): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  
  if (!data.pan_number.trim()) {
    alert('Please enter PAN number');
    return false;
  }
  if (!panRegex.test(data.pan_number)) {
    alert('Please enter a valid PAN number (e.g., ABCDE1234F)');
    return false;
  }
  return true;
}
