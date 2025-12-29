import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function BasicInfoStep() {
  const { formData, updateBasicInfo } = useOnboardingStore();
  const { basicInfo } = formData;

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
                  className="pr-12 h-14"
                />
                <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
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
                  className="pr-12 h-14"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
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
                  placeholder="Enter full registered office address"
                  value={basicInfo.address}
                  onChange={(e) => updateBasicInfo({ address: e.target.value })}
                  className="pr-12 min-h-[100px] resize-none"
                />
                <MapPin className="absolute right-4 top-4 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
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
  return true;
}

