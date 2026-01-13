import { FileText, Upload, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function DrugLicenseStep() {
  const { formData, updateDrugLicense } = useOnboardingStore();
  const { drugLicense } = formData;
  
  // Safety check - ensure drugLicense exists
  if (!drugLicense) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Drug License Information</h1>
        <p className="text-muted-foreground">
          Please let us know if you have a valid Drug License. If yes, provide the license details
          for additional verification.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Drug License Availability */}
            <div className="flex flex-col gap-3">
              <Label>
                Do you have a valid Drug License? <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={drugLicense.drug_license_status}
                onValueChange={(value) => {
                  const status = value as 'yes' | 'no';
                  // If user selects "no", clear any previously entered details
                  if (status === 'no') {
                    updateDrugLicense({
                      drug_license_status: status,
                      drug_license_number: '',
                      drug_license_document: null,
                    });
                  } else {
                    updateDrugLicense({
                      drug_license_status: status,
                    });
                  }
                }}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="drug_license_yes" />
                  <Label htmlFor="drug_license_yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="drug_license_no" />
                  <Label htmlFor="drug_license_no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Drug License Details - show only if status is Yes */}
            {drugLicense.drug_license_status === 'yes' && (
              <>
                {/* Drug License Number */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="drug_license_number">
                    Drug License Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="drug_license_number"
                      type="text"
                      placeholder="Enter drug license number"
                      value={drugLicense.drug_license_number || ''}
                      onChange={(e) => updateDrugLicense({ drug_license_number: e.target.value })}
                      className="pr-12 h-14"
                    />
                    <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter your valid drug license number for verification purposes.
                  </p>
                </div>

                {/* Drug License Document Upload */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="drug_license_document">
                    Upload Drug License Document
                  </Label>
                  <div className="flex flex-col gap-3">
                    {drugLicense.drug_license_document ? (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{drugLicense.drug_license_document.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(drugLicense.drug_license_document.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateDrugLicense({ drug_license_document: null })}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          id="drug_license_document"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateDrugLicense({ drug_license_document: file });
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

export function validateDrugLicense(data: {
  drug_license_status: string;
  drug_license_number: string;
  drug_license_document?: File | null;
}): boolean {
  // Drug license is optional overall, but if status is "yes", number is required
  if (!data.drug_license_status) {
    // Silent pass if user hasn't interacted; the step-level validation can decide if needed
    return true;
  }

  if (data.drug_license_status === 'yes') {
    if (!data.drug_license_number.trim()) {
      alert('Please enter Drug License Number');
      return false;
    }

    if (data.drug_license_document && data.drug_license_document.size > 5 * 1024 * 1024) {
      alert('Drug license document size should be less than 5MB');
      return false;
    }
  } else {
    // If status is "no", ignore any entered values
    return true;
  }

  return true;
}

