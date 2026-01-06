import { CreditCard, Upload, X, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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

            {/* PAN Document Upload */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="pan_document">
                Upload PAN Document <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-col gap-3">
                {panDetails.pan_document ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{panDetails.pan_document.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(panDetails.pan_document.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePANDetails({ pan_document: null })}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="pan_document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updatePANDetails({ pan_document: file });
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function validatePANDetails(data: {
  pan_number: string;
  pan_document?: File | null;
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
  if (!data.pan_document) {
    alert('Please upload PAN document');
    return false;
  }
  if (data.pan_document.size > 5 * 1024 * 1024) {
    alert('PAN document size should be less than 5MB');
    return false;
  }
  return true;
}
