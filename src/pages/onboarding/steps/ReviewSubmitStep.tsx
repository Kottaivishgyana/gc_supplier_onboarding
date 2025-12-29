import { Badge, CreditCard, FileText, Building2, Store, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';

interface ReviewSectionProps {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({ title, icon, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="border-b border-border pb-6 last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <Button variant="link" size="sm" onClick={onEdit} className="gap-1 text-primary">
          <Pencil className="w-3 h-3" />
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {children}
      </div>
    </div>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  );
}

export function ReviewSubmitStep() {
  const { formData, goToStep, setTermsAccepted } = useOnboardingStore();
  const { basicInfo, panDetails, gstInfo, bankAccount, msmeStatus, termsAccepted } = formData;

  const maskAccountNumber = (num: string) => {
    if (num.length <= 4) return num;
    return '••••' + num.slice(-4);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Review & Submit</h1>
        <p className="text-muted-foreground">
          Please review all the information before submitting your onboarding application.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Basic Info */}
            <ReviewSection
              title="Basic Information"
              icon={<Badge className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(1)}
            >
              <ReviewItem label="Supplier Name" value={basicInfo.company_name} />
              <ReviewItem label="Email" value={basicInfo.email} />
              <ReviewItem label="Phone" value={basicInfo.phone} />
              <ReviewItem label="Address" value={basicInfo.address} />
              <ReviewItem label="City" value={basicInfo.city} />
              <ReviewItem label="State" value={basicInfo.state} />
              <ReviewItem label="PIN Code" value={basicInfo.pincode} />
            </ReviewSection>

            {/* PAN Details */}
            <ReviewSection
              title="PAN Details"
              icon={<CreditCard className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(2)}
            >
              <ReviewItem label="PAN Number" value={panDetails.pan_number} />
            </ReviewSection>

            {/* GST Info */}
            <ReviewSection
              title="GST Information"
              icon={<FileText className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(3)}
            >
              <ReviewItem
                label="GST Status"
                value={gstInfo.gst_status === 'registered' ? 'Registered' : 'Not Registered'}
              />
              {gstInfo.gst_status === 'registered' && (
                <ReviewItem label="GSTIN" value={gstInfo.gst_number} />
              )}
            </ReviewSection>

            {/* Bank Account */}
            <ReviewSection
              title="Bank Account"
              icon={<Building2 className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(4)}
            >
              <ReviewItem label="Account Holder" value={bankAccount.account_name} />
              <ReviewItem
                label="Account Number"
                value={maskAccountNumber(bankAccount.account_number)}
              />
              <ReviewItem label="IFSC Code" value={bankAccount.ifsc_code} />
              <ReviewItem label="Bank Name" value={bankAccount.bank_name} />
              <ReviewItem label="Branch" value={bankAccount.branch_name} />
            </ReviewSection>

            {/* MSME Status */}
            <ReviewSection
              title="MSME Status"
              icon={<Store className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(5)}
            >
              <ReviewItem
                label="MSME Registered"
                value={msmeStatus.msme_status === 'yes' ? 'Yes' : 'No'}
              />
              {msmeStatus.msme_status === 'yes' && (
                <ReviewItem label="Udyam Number" value={msmeStatus.msme_number} />
              )}
            </ReviewSection>

            {/* Terms & Conditions */}
            <div className="mt-4 pt-6 border-t">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I hereby declare that all the information provided above is true and
                  correct to the best of my knowledge. I understand that any false
                  information may result in rejection of my application.
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validateReviewSubmit(termsAccepted: boolean): boolean {
  if (!termsAccepted) {
    alert('Please accept the terms and conditions to proceed');
    return false;
  }
  return true;
}
