import { Badge, CreditCard, FileText, Building2, Store, Pencil, User, Pill, Receipt, AlertCircle, CheckCircle2 } from 'lucide-react';
import { message } from 'antd';
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
  const { formData, goToStep, setTermsAccepted, panVerificationStatus, gstVerificationStatus, bankVerificationStatus, msmeVerificationStatus } = useOnboardingStore();
  const { 
    basicInfo, 
    contactInformation,
    panDetails, 
    gstInfo, 
    bankAccount, 
    msmeStatus, 
    drugLicense,
    commercialDetails,
    termsAccepted 
  } = formData;

  const maskAccountNumber = (num: string) => {
    if (!num || num.length <= 4) return num || '—';
    return '••••' + num.slice(-4);
  };

  const formatEscalationRole = (role: string) => {
    if (role === 'hod') return 'HOD';
    if (role === 'proprietor') return 'Proprietor';
    if (role === 'head') return 'Head';
    return role || '—';
  };

  const formatDiscountBasis = (basis: string) => {
    if (basis === 'PTS') return 'On PTS';
    if (basis === 'PTR') return 'On PTR';
    if (basis === 'MRP') return 'On MRP';
    return basis || '—';
  };

  const formatInvoiceDiscountType = (type: string) => {
    // Values are already in correct format, just return as-is
    return type || '—';
  };

  const formatReturnDamageType = (type: string) => {
    // Values are already in correct format, just return as-is
    return type || '—';
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
              <ReviewItem label="Business Type" value={basicInfo.business_type} />
              <ReviewItem label="Address" value={basicInfo.address} />
              <ReviewItem label="City" value={basicInfo.city} />
              <ReviewItem label="State" value={basicInfo.state} />
              <ReviewItem label="PIN Code" value={basicInfo.pincode} />
              {basicInfo.billing_address_different && (
                <>
                  <ReviewItem label="Billing Address" value={basicInfo.billing_address} />
                  <ReviewItem label="Billing City" value={basicInfo.billing_city} />
                  <ReviewItem label="Billing State" value={basicInfo.billing_state} />
                  <ReviewItem label="Billing PIN Code" value={basicInfo.billing_pincode} />
                </>
              )}
            </ReviewSection>

            {/* Contact Information */}
            <ReviewSection
              title="Contact Information"
              icon={<User className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(2)}
            >
              <div className="col-span-2">
                <p className="text-sm font-semibold mb-2 text-muted-foreground">For Transaction</p>
              </div>
              <ReviewItem label="Transaction Name" value={contactInformation.transaction_name} />
              <ReviewItem label="Transaction Contact" value={contactInformation.transaction_contact} />
              <ReviewItem label="Transaction Email" value={contactInformation.transaction_email} />
              <div className="col-span-2 mt-2">
                <p className="text-sm font-semibold mb-2 text-muted-foreground">For Additional Communication</p>
              </div>
              <ReviewItem label="Additional Communication Name" value={contactInformation.escalation_name} />
              <ReviewItem 
                label="HOD/Proprietor/Head" 
                value={formatEscalationRole(contactInformation.escalation_role)} 
              />
              <ReviewItem label="Additional Communication Contact" value={contactInformation.escalation_contact} />
              <ReviewItem label="Additional Communication Email" value={contactInformation.escalation_email} />
              <div className="col-span-2 mt-2">
                <p className="text-sm font-semibold mb-2 text-muted-foreground">For Additional Communication</p>
              </div>
              <ReviewItem label="Additional Communication Name" value={contactInformation.additional_contact2_name} />
              <ReviewItem 
                label="HOD/Proprietor/Head" 
                value={formatEscalationRole(contactInformation.additional_contact2_role)} 
              />
              <ReviewItem label="Additional Communication Contact" value={contactInformation.additional_contact2} />
              <ReviewItem label="Additional Communication Email" value={contactInformation.additional_contact2_email} />
              {contactInformation.additional_contact_name && (
                <>
                  <div className="col-span-2 mt-2">
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">For Additional Communication (Optional)</p>
                  </div>
                  <ReviewItem label="Additional Communication Name (Optional)" value={contactInformation.additional_contact_name} />
                  {contactInformation.additional_contact_role && (
                    <ReviewItem 
                      label="HOD/Proprietor/Head" 
                      value={formatEscalationRole(contactInformation.additional_contact_role)} 
                    />
                  )}
                  {contactInformation.additional_contact && (
                    <ReviewItem label="Additional Communication Contact (Optional)" value={contactInformation.additional_contact} />
                  )}
                  {contactInformation.additional_contact_email && (
                    <ReviewItem label="Additional Communication Email (Optional)" value={contactInformation.additional_contact_email} />
                  )}
                </>
              )}
            </ReviewSection>

            {/* PAN Details */}
            <ReviewSection
              title="PAN Details"
              icon={<CreditCard className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(3)}
            >
              <ReviewItem label="PAN Number" value={panDetails.pan_number} />
              <ReviewItem label="Full Name (as per PAN)" value={panDetails.full_name} />
              <ReviewItem label="Date of Birth" value={panDetails.dob} />
              {panVerificationStatus === 'success' && (
                <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-800 border border-green-200">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">PAN verified successfully</span>
                </div>
              )}
              {panVerificationStatus === 'error' && (
                <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">PAN verification failed. You can still submit the form.</span>
                </div>
              )}
              {(panVerificationStatus === null || panVerificationStatus === 'pending') && (
                <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">PAN verification not completed. You can still submit the form.</span>
                </div>
              )}
            </ReviewSection>

            {/* GST Info */}
            <ReviewSection
              title="GST Information"
              icon={<FileText className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(4)}
            >
              <ReviewItem
                label="GST Status"
                value={gstInfo.gst_status === 'registered' ? 'Registered' : gstInfo.gst_status === 'not_registered' ? 'Not Registered' : '—'}
              />
              {gstInfo.gst_status === 'registered' && (
                <>
                  <ReviewItem label="GSTIN" value={gstInfo.gst_number} />
                  {gstVerificationStatus === 'success' && (
                    <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-800 border border-green-200">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">GST verified successfully</span>
                    </div>
                  )}
                  {gstVerificationStatus === 'error' && (
                    <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">GST verification failed. You can still submit the form.</span>
                    </div>
                  )}
                  {(gstVerificationStatus === null || gstVerificationStatus === 'pending') && (
                    <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">GST verification not completed. You can still submit the form.</span>
                    </div>
                  )}
                </>
              )}
            </ReviewSection>

            {/* Bank Account */}
            <ReviewSection
              title="Bank Account"
              icon={<Building2 className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(5)}
            >
              <ReviewItem label="Account Holder" value={bankAccount.account_name} />
              <ReviewItem
                label="Account Number"
                value={maskAccountNumber(bankAccount.account_number)}
              />
              <ReviewItem label="IFSC Code" value={bankAccount.ifsc_code} />
              <ReviewItem label="Bank Name" value={bankAccount.bank_name} />
              <ReviewItem label="Branch" value={bankAccount.branch_name} />
              {bankVerificationStatus === 'success' && (
                <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-800 border border-green-200">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Bank account verified successfully</span>
                </div>
              )}
              {bankVerificationStatus === 'error' && (
                <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Bank account verification failed. You can still submit the form.</span>
                </div>
              )}
              {(bankVerificationStatus === null || bankVerificationStatus === 'pending') && (
                <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Bank account verification not completed. You can still submit the form.</span>
                </div>
              )}
            </ReviewSection>

            {/* MSME Status */}
            <ReviewSection
              title="MSME Status"
              icon={<Store className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(6)}
            >
              <ReviewItem
                label="MSME Registered"
                value={msmeStatus.msme_status === 'yes' ? 'Yes' : msmeStatus.msme_status === 'no' ? 'No' : '—'}
              />
              {msmeStatus.msme_status === 'yes' && (
                <>
                  <ReviewItem label="Udyam Number" value={msmeStatus.msme_number} />
                  {msmeVerificationStatus === 'success' && (
                    <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-800 border border-green-200">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">MSME verified successfully</span>
                    </div>
                  )}
                  {msmeVerificationStatus === 'error' && (
                    <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800 border border-red-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">MSME verification failed. You can still submit the form.</span>
                    </div>
                  )}
                  {(msmeVerificationStatus === null || msmeVerificationStatus === 'pending') && (
                    <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">MSME verification not completed. You can still submit the form.</span>
                    </div>
                  )}
                </>
              )}
            </ReviewSection>

            {/* Drug License */}
            <ReviewSection
              title="Drug License"
              icon={<Pill className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(7)}
            >
              <ReviewItem label="Drug License Number" value={drugLicense.drug_license_number} />
              {drugLicense.drug_license_document && (
                <ReviewItem 
                  label="Document" 
                  value={drugLicense.drug_license_document.name || 'Uploaded'} 
                />
              )}
            </ReviewSection>

            {/* Commercial Details */}
            <ReviewSection
              title="Commercial Details"
              icon={<Receipt className="w-5 h-5 text-primary" />}
              onEdit={() => goToStep(8)}
            >
              <ReviewItem label="Credit Days" value={`${commercialDetails.credit_days} days`} />
              <ReviewItem label="Delivery" value={commercialDetails.delivery} />
              <ReviewItem 
                label="Discount Basis" 
                value={formatDiscountBasis(commercialDetails.discount_basis)} 
              />
              <ReviewItem 
                label="Invoice Discount Type" 
                value={formatInvoiceDiscountType(commercialDetails.invoice_discount_type)} 
              />
              {commercialDetails.invoice_discount_percentage && (
                <ReviewItem 
                  label="Invoice Discount %" 
                  value={`${commercialDetails.invoice_discount_percentage}%`} 
                />
              )}
              <ReviewItem 
                label="Authorized Distributor" 
                value={commercialDetails.is_authorized_distributor || '—'} 
              />
              {commercialDetails.is_authorized_distributor === 'Yes' && commercialDetails.authorized_distributors && commercialDetails.authorized_distributors.length > 0 && (
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-2">Authorized Manufacturers:</p>
                  <div className="flex flex-col gap-2">
                    {commercialDetails.authorized_distributors.map((item, idx) => (
                      <div key={idx} className="p-2 border rounded bg-muted/30">
                        <p className="font-medium text-sm">{item.manufacturer_name || `Manufacturer ${idx + 1}`}</p>
                        {item.document && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.document.name} ({(item.document.size / 1024).toFixed(2)} KB)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="col-span-2 mt-2">
                <p className="text-sm font-semibold mb-2 text-muted-foreground">Return Policy</p>
              </div>
              <ReviewItem label="Non Moving" value={`${commercialDetails.return_non_moving}% CN`} />
              {commercialDetails.return_short_expiry_percentage && (
                <ReviewItem 
                  label="Short Expiry" 
                  value={`${commercialDetails.return_short_expiry_percentage}%`} 
                />
              )}
              <ReviewItem 
                label="Damage" 
                value={formatReturnDamageType(commercialDetails.return_damage_type)} 
              />
              {commercialDetails.return_expired_percentage && (
                <ReviewItem 
                  label="Expired" 
                  value={`${commercialDetails.return_expired_percentage}%`} 
                />
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
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer flex flex-col gap-2"
                >
                  <p className="font-semibold text-foreground">Terms and Conditions:</p>
                  <ol className="list-decimal pl-4 space-y-1 flex flex-col">
                    <li>
                      Supplier/Distributor has to confirm any change in PTR%, Margin% or Net Rate to Geri Care
                      group of hospitals before raising any invoice.
                    </li>
                    <li>
                      Geri Care Hospitals are authorized to debit the vendor if Cash Discount / Margin is not
                      provided as per the agreement.
                    </li>
                    <li>
                      By signing this registration form, Supplier/Distributor hereby agrees to abide by the terms
                      and conditions and the same shall be binding on all transactions between the Vendor and
                      Geri Care group of hospitals. All purchases shall be subject to issuance of a separate PO
                      (hard copy / mail).
                    </li>
                    <li>
                      All goods invoice must accompany list of goods and quantities, delivery challan, quality /
                      technical specifications (whenever called for), GST, MRP, Batch No., manufacturing and
                      expiry date etc.
                    </li>
                    <li>
                      For Rate contract items, the distributor/supplier should supply at manufacturer&apos;s agreed
                      purchase rate / margin. If failed, then any difference in purchase price / margin by the
                      manufacturer agreed to Geri Care group of hospitals should be compensated with 100%
                      credit note.
                    </li>
                    <li>
                      Returnable stocks –
                      <br />
                      a) For non-moving items, credit note to be issued within a week.
                      <br />
                      b) For short-expiry items, credit note to be issued within 30–45 days.
                      <br />
                      c) Any goods that are damaged, contaminated or otherwise liable to be replaced within 3
                      days&apos; time or returned at the cost of distributor/supplier, and Geri Care group of hospitals
                      shall not be held liable for any costs arising therefrom.
                    </li>
                    <li>
                      If any offers are available in PO nearby quantity, the same has to be communicated via mail
                      and confirmation on this regard will be ensured at our end.
                    </li>
                    <li>
                      Any unethical activities being done for the promotion of the product being dealt is strictly
                      prohibited. Any seasonal gift items are also to be done with prior intimation and approval
                      by the centralized purchase department team and any such gift distribution even approved
                      also to be routed through the centralized purchase department. Any such unauthorized
                      activities if noticed lead to stoppage of due payments and termination of future business.
                    </li>
                  </ol>
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
  // Destroy previous messages to show only one error at a time
  message.destroy();
  
  if (!termsAccepted) {
    message.error({ content: 'Please accept the terms and conditions to proceed', key: 'validation-error' });
    return false;
  }
  return true;
}
