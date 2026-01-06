import { useMemo } from 'react';
import { Building2, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { INDIAN_STATES } from '@/types/onboarding';
import { validatePincodeForState } from '@/utils/pincodeValidator';

export function BasicInfoStep() {
  const { formData, updateBasicInfo, supplierData } = useOnboardingStore();
  const { basicInfo } = formData;
  
  // Validate PIN code when state or pincode changes
  const pincodeError = useMemo(() => {
    if (basicInfo.pincode.length === 6 && basicInfo.state) {
      const validation = validatePincodeForState(basicInfo.pincode, basicInfo.state);
      return validation.isValid ? '' : validation.message;
    }
    return '';
  }, [basicInfo.pincode, basicInfo.state]);

  // Validate billing PIN code when billing state or billing pincode changes
  const billingPincodeError = useMemo(() => {
    if (basicInfo.billing_pincode.length === 6 && basicInfo.billing_state) {
      const validation = validatePincodeForState(basicInfo.billing_pincode, basicInfo.billing_state);
      return validation.isValid ? '' : validation.message;
    }
    return '';
  }, [basicInfo.billing_pincode, basicInfo.billing_state]);
  
  // Fields are read-only if pre-filled from ERPNext
  const isSupplierNameReadOnly = !!supplierData?.supplier_name;
  const isEmailReadOnly = !!supplierData?.email_id;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Basic Information</h1>
        <p className="text-muted-foreground">
          Please fill in your company details accurately. This information will
          be used for verification purposes.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Supplier Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="company_name">
                Supplier Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="company_name"
                  placeholder="Enter supplier name"
                  value={basicInfo.company_name}
                  onChange={(e) =>
                    updateBasicInfo({ company_name: e.target.value })
                  }
                  readOnly={isSupplierNameReadOnly}
                  className={`pr-12 h-14 ${isSupplierNameReadOnly ? 'bg-muted cursor-not-allowed' : ''}`}
                />
                <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              {isSupplierNameReadOnly && (
                <p className="text-sm text-muted-foreground">
                  This field is pre-filled and cannot be edited
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter official email address"
                  value={basicInfo.email}
                  onChange={(e) => updateBasicInfo({ email: e.target.value })}
                  readOnly={isEmailReadOnly}
                  className={`pr-12 h-14 ${isEmailReadOnly ? 'bg-muted cursor-not-allowed' : ''}`}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              {isEmailReadOnly && (
                <p className="text-sm text-muted-foreground">
                  This field is pre-filled and cannot be edited
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter contact number"
                  value={basicInfo.phone}
                  onChange={(e) => updateBasicInfo({ phone: e.target.value })}
                  className="pr-12 h-14"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Business Type */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="business_type">
                Business Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={basicInfo.business_type}
                onValueChange={(value) => updateBasicInfo({ business_type: value })}
              >
                <SelectTrigger className="h-14">
                  <SelectValue placeholder="Select Business Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">
                Registered Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="address"
                  placeholder="Enter street address"
                  value={basicInfo.address}
                  onChange={(e) => updateBasicInfo({ address: e.target.value })}
                  className="pr-12 min-h-[80px] resize-none"
                />
                <MapPin className="absolute right-4 top-4 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={basicInfo.city}
                onChange={(e) => updateBasicInfo({ city: e.target.value })}
                className="h-14"
              />
            </div>

            {/* State */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">
                State <span className="text-destructive">*</span>
              </Label>
              <Select
                value={basicInfo.state}
                onValueChange={(value) => updateBasicInfo({ state: value })}
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

            {/* Pincode */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="pincode">
                PIN Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pincode"
                placeholder="Enter 6-digit PIN code"
                value={basicInfo.pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  updateBasicInfo({ pincode: value });
                }}
                maxLength={6}
                className={`h-14 ${pincodeError ? 'border-destructive' : ''}`}
                aria-invalid={!!pincodeError}
              />
              {pincodeError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{pincodeError}</span>
                </div>
              )}
            </div>

            {/* Billing Address Different Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                id="billing_address_different"
                checked={basicInfo.billing_address_different}
                onCheckedChange={(checked) =>
                  updateBasicInfo({ billing_address_different: checked === true })
                }
              />
              <Label
                htmlFor="billing_address_different"
                className="text-sm font-normal cursor-pointer"
              >
                Billing address is different from registered address
              </Label>
            </div>

            {/* Billing Address Fields - Show only if checkbox is checked */}
            {basicInfo.billing_address_different && (
              <>
                <div className="border-t pt-6 mt-2">
                  <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                </div>

                {/* Billing Address */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="billing_address">
                    Billing Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="billing_address"
                      placeholder="Enter billing street address"
                      value={basicInfo.billing_address}
                      onChange={(e) => updateBasicInfo({ billing_address: e.target.value })}
                      className="pr-12 min-h-[80px] resize-none"
                    />
                    <MapPin className="absolute right-4 top-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Billing City */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="billing_city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="billing_city"
                    placeholder="Enter city"
                    value={basicInfo.billing_city}
                    onChange={(e) => updateBasicInfo({ billing_city: e.target.value })}
                    className="h-14"
                  />
                </div>

                {/* Billing State */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="billing_state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={basicInfo.billing_state}
                    onValueChange={(value) => updateBasicInfo({ billing_state: value })}
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

                {/* Billing Pincode */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="billing_pincode">
                    PIN Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="billing_pincode"
                    placeholder="Enter 6-digit PIN code"
                    value={basicInfo.billing_pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      updateBasicInfo({ billing_pincode: value });
                    }}
                    maxLength={6}
                    className={`h-14 ${billingPincodeError ? 'border-destructive' : ''}`}
                    aria-invalid={!!billingPincodeError}
                  />
                  {billingPincodeError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{billingPincodeError}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function validateBasicInfo(data: {
  company_name: string;
  email: string;
  phone: string;
  business_type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  billing_address_different: boolean;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_pincode: string;
}): boolean {
  if (!data.company_name.trim()) {
    alert('Please enter supplier name');
    return false;
  }
  if (!data.email.trim() || !data.email.includes('@')) {
    alert('Please enter a valid email address');
    return false;
  }
  if (!data.phone.trim()) {
    alert('Please enter phone number');
    return false;
  }
  if (!data.business_type) {
    alert('Please select business type');
    return false;
  }
  if (!data.address.trim()) {
    alert('Please enter registered address');
    return false;
  }
  if (!data.city.trim()) {
    alert('Please enter city');
    return false;
  }
  if (!data.state) {
    alert('Please select state');
    return false;
  }
  if (!data.pincode.trim() || data.pincode.length !== 6) {
    alert('Please enter a valid 6-digit PIN code');
    return false;
  }
  
  // Validate PIN code matches state
  const pincodeValidation = validatePincodeForState(data.pincode, data.state);
  if (!pincodeValidation.isValid) {
    alert(pincodeValidation.message);
    return false;
  }
  
  // Validate billing address if different
  if (data.billing_address_different) {
    if (!data.billing_address.trim()) {
      alert('Please enter billing address');
      return false;
    }
    if (!data.billing_city.trim()) {
      alert('Please enter billing city');
      return false;
    }
    if (!data.billing_state) {
      alert('Please select billing state');
      return false;
    }
    if (!data.billing_pincode.trim() || data.billing_pincode.length !== 6) {
      alert('Please enter a valid 6-digit billing PIN code');
      return false;
    }
    
    // Validate billing PIN code matches billing state
    const billingPincodeValidation = validatePincodeForState(data.billing_pincode, data.billing_state);
    if (!billingPincodeValidation.isValid) {
      alert(billingPincodeValidation.message);
      return false;
    }
  }
  
  return true;
}
