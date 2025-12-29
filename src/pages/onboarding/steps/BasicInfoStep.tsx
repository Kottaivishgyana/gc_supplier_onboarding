import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { INDIAN_STATES } from '@/types/onboarding';

export function BasicInfoStep() {
  const { formData, updateBasicInfo, supplierData } = useOnboardingStore();
  const { basicInfo } = formData;
  
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
                className="h-14"
              />
            </div>
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
  address: string;
  city: string;
  state: string;
  pincode: string;
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
  return true;
}
