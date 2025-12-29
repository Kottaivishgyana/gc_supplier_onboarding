import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { INDIAN_STATES } from '@/types/onboarding';

export function GSTInfoStep() {
  const { formData, updateGSTInfo } = useOnboardingStore();
  const { gstInfo } = formData;

  const handleGSTNumberChange = (value: string) => {
    updateGSTInfo({ gst_number: value.toUpperCase() });
  };

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
                onValueChange={(value) =>
                  updateGSTInfo({ gst_status: value as 'registered' | 'not_registered' })
                }
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
            )}

            {/* GST State */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="gst_state">
                State of Registration <span className="text-destructive">*</span>
              </Label>
              <Select
                value={gstInfo.gst_state}
                onValueChange={(value) => updateGSTInfo({ gst_state: value })}
              >
                <SelectTrigger className="h-14">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validateGSTInfo(data: {
  gst_status: string;
  gst_number: string;
  gst_state: string;
}): boolean {
  if (!data.gst_status) {
    alert('Please select GST registration status');
    return false;
  }
  if (data.gst_status === 'registered' && !data.gst_number.trim()) {
    alert('Please enter GSTIN');
    return false;
  }
  if (data.gst_status === 'registered' && data.gst_number.length !== 15) {
    alert('GSTIN must be 15 characters');
    return false;
  }
  if (!data.gst_state) {
    alert('Please select state of registration');
    return false;
  }
  return true;
}
