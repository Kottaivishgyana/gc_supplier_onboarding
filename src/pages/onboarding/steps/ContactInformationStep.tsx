import { User, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function ContactInformationStep() {
  const { formData, updateContactInformation } = useOnboardingStore();
  const contactInformation = formData.contactInformation || {
    transaction_name: '',
    transaction_contact: '',
    transaction_email: '',
    escalation_name: '',
    escalation_role: '',
    escalation_contact: '',
    escalation_email: '',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contact of Supplier</h1>
        <p className="text-muted-foreground">
          Please provide contact details for transaction and escalation purposes.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-8">
            {/* For Transaction Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-semibold">For Transaction</h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-4 ml-4">
                PO/ Billing Person
              </p>

              <div className="flex flex-col gap-6 ml-4">
                {/* Transaction Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="transaction_name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="transaction_name"
                      placeholder="Enter name"
                      value={contactInformation.transaction_name}
                      onChange={(e) =>
                        updateContactInformation({ transaction_name: e.target.value })
                      }
                      className="pr-12 h-14"
                    />
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Transaction Contact */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="transaction_contact">
                    Contact <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="transaction_contact"
                      type="tel"
                      placeholder="Enter contact number"
                      value={contactInformation.transaction_contact}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        updateContactInformation({ transaction_contact: value });
                      }}
                      maxLength={10}
                      className="pr-12 h-14"
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Transaction Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="transaction_email">
                    Email id <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="transaction_email"
                      type="email"
                      placeholder="Enter email address"
                      value={contactInformation.transaction_email}
                      onChange={(e) =>
                        updateContactInformation({ transaction_email: e.target.value })
                      }
                      className="pr-12 h-14"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* For Escalation Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-semibold">For Escalation</h2>
              </div>

              <div className="flex flex-col gap-6 ml-4">
                {/* Escalation Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="escalation_name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="escalation_name"
                      placeholder="Enter name"
                      value={contactInformation.escalation_name}
                      onChange={(e) =>
                        updateContactInformation({ escalation_name: e.target.value })
                      }
                      className="pr-12 h-14"
                    />
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* HOD/Proprietor/Head Radio Selection */}
                <div className="flex flex-col gap-3">
                  <Label>
                    HOD/Proprietor/Head <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={contactInformation.escalation_role}
                    onValueChange={(value) =>
                      updateContactInformation({ escalation_role: value as 'hod' | 'proprietor' | 'head' })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="hod" id="escalation_hod" />
                      <Label htmlFor="escalation_hod" className="font-normal cursor-pointer">
                        HOD
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="proprietor" id="escalation_proprietor" />
                      <Label htmlFor="escalation_proprietor" className="font-normal cursor-pointer">
                        Proprietor
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="head" id="escalation_head" />
                      <Label htmlFor="escalation_head" className="font-normal cursor-pointer">
                        Head
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Escalation Contact */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="escalation_contact">
                    Contact <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="escalation_contact"
                      type="tel"
                      placeholder="Enter contact number"
                      value={contactInformation.escalation_contact}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        updateContactInformation({ escalation_contact: value });
                      }}
                      maxLength={10}
                      className="pr-12 h-14"
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Escalation Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="escalation_email">
                    Email id <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="escalation_email"
                      type="email"
                      placeholder="Enter email address"
                      value={contactInformation.escalation_email}
                      onChange={(e) =>
                        updateContactInformation({ escalation_email: e.target.value })
                      }
                      className="pr-12 h-14"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function validateContactInformation(data: {
  transaction_name: string;
  transaction_contact: string;
  transaction_email: string;
  escalation_name: string;
  escalation_role: string;
  escalation_contact: string;
  escalation_email: string;
}): boolean {
  if (!data.transaction_name.trim()) {
    alert('Please enter transaction contact name');
    return false;
  }
  if (!data.transaction_contact.trim() || data.transaction_contact.length !== 10) {
    alert('Please enter a valid 10-digit transaction contact number');
    return false;
  }
  if (!data.transaction_email.trim() || !data.transaction_email.includes('@')) {
    alert('Please enter a valid transaction email address');
    return false;
  }
  if (!data.escalation_name.trim()) {
    alert('Please enter escalation contact name');
    return false;
  }
  if (!data.escalation_role || !['hod', 'proprietor', 'head'].includes(data.escalation_role)) {
    alert('Please select HOD, Proprietor, or Head');
    return false;
  }
  if (!data.escalation_contact.trim() || data.escalation_contact.length !== 10) {
    alert('Please enter a valid 10-digit escalation contact number');
    return false;
  }
  if (!data.escalation_email.trim() || !data.escalation_email.includes('@')) {
    alert('Please enter a valid escalation email address');
    return false;
  }
  return true;
}

