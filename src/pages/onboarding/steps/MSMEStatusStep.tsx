import { Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function MSMEStatusStep() {
  const { formData, updateMSMEStatus } = useOnboardingStore();
  const { msmeStatus } = formData;

  const handleMSMENumberChange = (value: string) => {
    updateMSMEStatus({ msme_number: value.toUpperCase() });
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
                onValueChange={(value) =>
                  updateMSMEStatus({ msme_status: value as 'yes' | 'no' })
                }
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
