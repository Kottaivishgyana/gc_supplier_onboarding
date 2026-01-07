import { Calendar, Truck, Percent, FileText, RotateCcw, Plus, X, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';
import type { AuthorizedDistributorItem } from '@/types/onboarding';

export function CommercialDetailsStep() {
  const { formData, updateCommercialDetails } = useOnboardingStore();
  const commercialDetails = formData.commercialDetails || {
    credit_days: '45',
    delivery: 'At our works at your cost',
    discount_basis: '',
    invoice_discount_type: '',
    invoice_discount_percentage: '',
    is_authorized_distributor: '',
    return_non_moving: '100',
    return_short_expiry_percentage: '',
    return_damage_type: '',
    return_expired_percentage: '',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Commercial Details</h1>
        <p className="text-muted-foreground">
          Please provide commercial terms and policies for your business.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-8">
            {/* Credit Days from Delivery date - Read Only */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="credit_days">
                Credit Days from Delivery date
              </Label>
              <div className="relative">
                <Input
                  id="credit_days"
                  value={commercialDetails.credit_days}
                  readOnly
                  className="pr-12 h-14 bg-muted cursor-not-allowed"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-sm text-muted-foreground">
                This field is pre-filled and cannot be edited
              </p>
            </div>

            {/* Delivery - Read Only */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="delivery">
                Delivery
              </Label>
              <div className="relative">
                <Input
                  id="delivery"
                  value={commercialDetails.delivery}
                  readOnly
                  className="pr-12 h-14 bg-muted cursor-not-allowed"
                />
                <Truck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-sm text-muted-foreground">
                This field is pre-filled and cannot be edited
              </p>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* Discount % */}
            <div className="flex flex-col gap-3">
              <Label>
                Discount % <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground -mt-2">
                On PTS/On PTR/On MRP (tick any)
              </p>
              <RadioGroup
                value={commercialDetails.discount_basis}
                onValueChange={(value) =>
                  updateCommercialDetails({ discount_basis: value as 'PTS' | 'PTR' | 'MRP' })
                }
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="PTS" id="discount_pts" />
                  <Label htmlFor="discount_pts" className="font-normal cursor-pointer">
                    On PTS
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="PTR" id="discount_ptr" />
                  <Label htmlFor="discount_ptr" className="font-normal cursor-pointer">
                    On PTR
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="MRP" id="discount_mrp" />
                  <Label htmlFor="discount_mrp" className="font-normal cursor-pointer">
                    On MRP
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Invoice Discount % */}
            <div className="flex flex-col gap-3">
              <Label>
                Invoice Discount % <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-col gap-4">
                <RadioGroup
                  value={commercialDetails.invoice_discount_type}
                  onValueChange={(value) =>
                    updateCommercialDetails({ invoice_discount_type: value as 'On Invoice' | 'Off Invoice' })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="On Invoice" id="invoice_on" />
                    <Label htmlFor="invoice_on" className="font-normal cursor-pointer">
                      On Invoice
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Off Invoice" id="invoice_off" />
                    <Label htmlFor="invoice_off" className="font-normal cursor-pointer">
                      Off Invoice
                    </Label>
                  </div>
                </RadioGroup>
                {commercialDetails.invoice_discount_type && (
                  <div className="flex flex-col gap-2 ml-4">
                    <Label htmlFor="invoice_discount_percentage">
                      Discount Percentage <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="invoice_discount_percentage"
                        type="number"
                        placeholder="Enter percentage"
                        value={commercialDetails.invoice_discount_percentage}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '').slice(0, 5);
                          updateCommercialDetails({ invoice_discount_percentage: value });
                        }}
                        className="pr-12 h-14"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manufacturer's Authorized distributor */}
            <div className="flex flex-col gap-3">
              <Label>
                Manufacturer's Authorized distributor <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={commercialDetails.is_authorized_distributor}
                onValueChange={(value) => {
                  const isYes = value === 'Yes';
                  updateCommercialDetails({ 
                    is_authorized_distributor: value as 'Yes' | 'No',
                    authorized_distributors: isYes && (!commercialDetails.authorized_distributors || commercialDetails.authorized_distributors.length === 0)
                      ? [{ manufacturer_name: '', document: null }]
                      : !isYes ? [] : commercialDetails.authorized_distributors
                  });
                }}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Yes" id="authorized_yes" />
                  <Label htmlFor="authorized_yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="No" id="authorized_no" />
                  <Label htmlFor="authorized_no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {commercialDetails.is_authorized_distributor === 'Yes' && (
                <div className="flex flex-col gap-4 ml-4 mt-2">
                  <Label className="text-sm font-medium">
                    Attach List of manufacturers who authorized yourself and a sample invoice copy of each
                  </Label>
                  
                  <div className="flex flex-col gap-3">
                    {(commercialDetails.authorized_distributors || []).map((item, index) => (
                      <div key={index} className="flex gap-3 items-start p-4 border rounded-lg bg-muted/30">
                        <div className="flex-1">
                          <Label htmlFor={`manufacturer_name_${index}`} className="text-xs text-muted-foreground mb-1 block">
                            Manufacturer Name
                          </Label>
                          <Input
                            id={`manufacturer_name_${index}`}
                            placeholder="Enter manufacturer name"
                            value={item.manufacturer_name || ''}
                            onChange={(e) => {
                              const updated = [...(commercialDetails.authorized_distributors || [])];
                              updated[index] = { ...updated[index], manufacturer_name: e.target.value };
                              updateCommercialDetails({ authorized_distributors: updated });
                            }}
                            className="h-10"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={`manufacturer_file_${index}`} className="text-xs text-muted-foreground mb-1 block">
                            Upload Document
                          </Label>
                          <div className="relative">
                            {item.document ? (
                              <div className="flex items-center justify-between p-2 border rounded bg-background">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                  <span className="text-sm truncate">{item.document.name}</span>
                                  <span className="text-xs text-muted-foreground flex-shrink-0">
                                    ({(item.document.size / 1024).toFixed(2)} KB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updated = [...(commercialDetails.authorized_distributors || [])];
                                    updated[index] = { ...updated[index], document: null };
                                    updateCommercialDetails({ authorized_distributors: updated });
                                  }}
                                  className="h-8 w-8 p-0 ml-2 flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="relative">
                                <Input
                                  id={`manufacturer_file_${index}`}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const updated = [...(commercialDetails.authorized_distributors || [])];
                                      updated[index] = { ...updated[index], document: file };
                                      updateCommercialDetails({ authorized_distributors: updated });
                                    }
                                  }}
                                  className="h-10 cursor-pointer"
                                />
                                <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...(commercialDetails.authorized_distributors || [])];
                            updated.splice(index, 1);
                            updateCommercialDetails({ authorized_distributors: updated });
                          }}
                          className="h-10 w-10 p-0 mt-6 flex-shrink-0"
                          disabled={(commercialDetails.authorized_distributors || []).length === 1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = commercialDetails.authorized_distributors || [];
                      updateCommercialDetails({
                        authorized_distributors: [...current, { manufacturer_name: '', document: null }]
                      });
                    }}
                    className="w-fit gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manufacturer
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Upload PDF, JPG, or PNG files for each manufacturer (Max 5MB per file)
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* Return Policy */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold">Return Policy</h3>

              {/* Non moving - Read Only */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="return_non_moving">
                  a. Non moving
                </Label>
                <div className="relative">
                  <Input
                    id="return_non_moving"
                    value={`${commercialDetails.return_non_moving}% CN`}
                    readOnly
                    className="pr-12 h-14 bg-muted cursor-not-allowed"
                  />
                  <RotateCcw className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
                <p className="text-sm text-muted-foreground">
                  CN value: 100%
                </p>
              </div>

              {/* Short expiry */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="return_short_expiry_percentage">
                  b. Short expiry (less than 90 days) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="return_short_expiry_percentage"
                    type="number"
                    placeholder="Enter percentage"
                    value={commercialDetails.return_short_expiry_percentage}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '').slice(0, 5);
                      updateCommercialDetails({ return_short_expiry_percentage: value });
                    }}
                    className="pr-12 h-14"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
                <p className="text-sm text-muted-foreground">
                  CN value: ____%
                </p>
              </div>

              {/* Damage */}
              <div className="flex flex-col gap-3">
                <Label>
                  c. Damage <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={commercialDetails.return_damage_type}
                  onValueChange={(value) =>
                    updateCommercialDetails({ return_damage_type: value as 'Replacement' | '100% CN' })
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Replacement" id="damage_replacement" />
                    <Label htmlFor="damage_replacement" className="font-normal cursor-pointer">
                      Replacement
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="100% CN" id="damage_100cn" />
                    <Label htmlFor="damage_100cn" className="font-normal cursor-pointer">
                      100% CN
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Expired */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="return_expired_percentage">
                  d. Expired <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="return_expired_percentage"
                    type="number"
                    placeholder="Enter percentage"
                    value={commercialDetails.return_expired_percentage}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '').slice(0, 5);
                      updateCommercialDetails({ return_expired_percentage: value });
                    }}
                    className="pr-12 h-14"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
                <p className="text-sm text-muted-foreground">
                  CN value: ____%
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
export function validateCommercialDetails(data: {
  credit_days: string;
  delivery: string;
  discount_basis: string;
  invoice_discount_type: string;
  invoice_discount_percentage: string;
  is_authorized_distributor: string;
  authorized_distributors?: AuthorizedDistributorItem[];
  return_non_moving: string;
  return_short_expiry_percentage: string;
  return_damage_type: string;
  return_expired_percentage: string;
}): boolean {
  if (!data.discount_basis) {
    alert('Please select discount basis (On PTS/On PTR/On MRP)');
    return false;
  }
  if (!data.invoice_discount_type) {
    alert('Please select invoice discount type (On Invoice/Off Invoice)');
    return false;
  }
  if (!data.invoice_discount_percentage.trim()) {
    alert('Please enter invoice discount percentage');
    return false;
  }
  const invoiceDiscount = parseFloat(data.invoice_discount_percentage);
  if (isNaN(invoiceDiscount) || invoiceDiscount < 0 || invoiceDiscount > 100) {
    alert('Please enter a valid discount percentage (0-100)');
    return false;
  }
  if (!data.is_authorized_distributor) {
    alert('Please select if you are a Manufacturer\'s Authorized distributor');
    return false;
  }
  if (data.is_authorized_distributor === 'Yes') {
    if (!data.authorized_distributors || data.authorized_distributors.length === 0) {
      alert('Please add at least one manufacturer with authorized distributor details');
      return false;
    }
    for (let i = 0; i < data.authorized_distributors.length; i++) {
      const item = data.authorized_distributors[i];
      if (!item.manufacturer_name.trim()) {
        alert(`Please enter manufacturer name for item ${i + 1}`);
        return false;
      }
      if (!item.document) {
        alert(`Please upload document for ${item.manufacturer_name || `item ${i + 1}`}`);
        return false;
      }
      if (item.document.size > 5 * 1024 * 1024) {
        alert(`Document for ${item.manufacturer_name} exceeds 5MB limit`);
        return false;
      }
    }
  }
  if (!data.return_short_expiry_percentage.trim()) {
    alert('Please enter return percentage for short expiry items');
    return false;
  }
  const shortExpiry = parseFloat(data.return_short_expiry_percentage);
  if (isNaN(shortExpiry) || shortExpiry < 0 || shortExpiry > 100) {
    alert('Please enter a valid short expiry return percentage (0-100)');
    return false;
  }
  if (!data.return_damage_type) {
    alert('Please select return policy for damaged items');
    return false;
  }
  if (!data.return_expired_percentage.trim()) {
    alert('Please enter return percentage for expired items');
    return false;
  }
  const expired = parseFloat(data.return_expired_percentage);
  if (isNaN(expired) || expired < 0 || expired > 100) {
    alert('Please enter a valid expired return percentage (0-100)');
    return false;
  }
  return true;
}

