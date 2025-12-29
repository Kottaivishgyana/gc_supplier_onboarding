import { Store } from 'lucide-react';
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

const MSME_CATEGORIES = [
  { value: 'micro', label: 'Micro Enterprise' },
  { value: 'small', label: 'Small Enterprise' },
  { value: 'medium', label: 'Medium Enterprise' },
];

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
              <>
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
                </div>

                {/* MSME Category */}
                {/* <div className="flex flex-col gap-2">
                  <Label htmlFor="msme_category">
                    Enterprise Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={msmeStatus.msme_category}
                    onValueChange={(value) =>
                      updateMSMEStatus({ msme_category: value })
                    }
                  >
                    <SelectTrigger className="h-14">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MSME_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
              </>
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
  msme_category: string;
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
    if (!data.msme_category) {
      alert('Please select enterprise category');
      return false;
    }
  }
  return true;
}
