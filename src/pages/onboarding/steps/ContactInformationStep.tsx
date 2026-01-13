import { User, Phone, Mail, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
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
    additional_contact2_name: '',
    additional_contact2_role: '',
    additional_contact2: '',
    additional_contact2_email: '',
    additional_contact_name: '',
    additional_contact: '',
    additional_contact_email: '',
    additional_contact_role: '',
  };

  const hasThirdContact = Boolean(
    contactInformation.additional_contact_name ||
    contactInformation.additional_contact ||
    contactInformation.additional_contact_email
  );

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

            {/* For Additional Communication Section (2nd Contact - Mandatory) */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-semibold">For additional communication</h2>
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

            {/* Divider */}
            <div className="border-t"></div>

            {/* For Additional Communication Section (2nd Contact - Mandatory) */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-semibold">For additional communication</h2>
              </div>

              <div className="flex flex-col gap-6 ml-4">
                {/* Additional Contact 2 Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="additional_contact2_name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="additional_contact2_name"
                      placeholder="Enter name"
                      value={contactInformation.additional_contact2_name || ''}
                      onChange={(e) =>
                        updateContactInformation({ additional_contact2_name: e.target.value })
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
                    value={contactInformation.additional_contact2_role || ''}
                    onValueChange={(value) =>
                      updateContactInformation({ additional_contact2_role: value as 'hod' | 'proprietor' | 'head' })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="hod" id="additional_contact2_hod" />
                      <Label htmlFor="additional_contact2_hod" className="font-normal cursor-pointer">
                        HOD
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="proprietor" id="additional_contact2_proprietor" />
                      <Label htmlFor="additional_contact2_proprietor" className="font-normal cursor-pointer">
                        Proprietor
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="head" id="additional_contact2_head" />
                      <Label htmlFor="additional_contact2_head" className="font-normal cursor-pointer">
                        Head
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Contact 2 */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="additional_contact2">
                    Contact <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="additional_contact2"
                      type="tel"
                      placeholder="Enter contact number"
                      value={contactInformation.additional_contact2 || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        updateContactInformation({ additional_contact2: value });
                      }}
                      maxLength={10}
                      className="pr-12 h-14"
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Additional Contact 2 Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="additional_contact2_email">
                    Email id <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="additional_contact2_email"
                      type="email"
                      placeholder="Enter email address"
                      value={contactInformation.additional_contact2_email || ''}
                      onChange={(e) =>
                        updateContactInformation({ additional_contact2_email: e.target.value })
                      }
                      className="pr-12 h-14"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Third Contact Section */}
            {hasThirdContact && (
              <>
                <div className="border-t"></div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <h2 className="text-xl font-semibold">For additional communication (Optional)</h2>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateContactInformation({
                          additional_contact_name: '',
                          additional_contact: '',
                          additional_contact_email: '',
                          additional_contact_role: '',
                        });
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-6 ml-4">
                    {/* Additional Contact Name */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="additional_contact_name">
                        Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="additional_contact_name"
                          placeholder="Enter name"
                          value={contactInformation.additional_contact_name || ''}
                          onChange={(e) =>
                            updateContactInformation({ additional_contact_name: e.target.value })
                          }
                          className="pr-12 h-14"
                        />
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {/* HOD/Proprietor/Head Radio Selection */}
                    <div className="flex flex-col gap-3">
                      <Label>
                        HOD/Proprietor/Head
                      </Label>
                      <RadioGroup
                        value={contactInformation.additional_contact_role || ''}
                        onValueChange={(value) =>
                          updateContactInformation({ additional_contact_role: value as 'hod' | 'proprietor' | 'head' })
                        }
                        className="flex gap-6"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="hod" id="additional_hod" />
                          <Label htmlFor="additional_hod" className="font-normal cursor-pointer">
                            HOD
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="proprietor" id="additional_proprietor" />
                          <Label htmlFor="additional_proprietor" className="font-normal cursor-pointer">
                            Proprietor
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="head" id="additional_head" />
                          <Label htmlFor="additional_head" className="font-normal cursor-pointer">
                            Head
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Additional Contact */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="additional_contact">
                        Contact
                      </Label>
                      <div className="relative">
                        <Input
                          id="additional_contact"
                          type="tel"
                          placeholder="Enter contact number"
                          value={contactInformation.additional_contact || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            updateContactInformation({ additional_contact: value });
                          }}
                          maxLength={10}
                          className="pr-12 h-14"
                        />
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {/* Additional Contact Email */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="additional_contact_email">
                        Email id
                      </Label>
                      <div className="relative">
                        <Input
                          id="additional_contact_email"
                          type="email"
                          placeholder="Enter email address"
                          value={contactInformation.additional_contact_email || ''}
                          onChange={(e) =>
                            updateContactInformation({ additional_contact_email: e.target.value })
                          }
                          className="pr-12 h-14"
                        />
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Add Third Contact Button */}
            {!hasThirdContact && (
              <div className="border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Set a placeholder value so hasThirdContact becomes true and section appears
                    updateContactInformation({
                      additional_contact_name: ' ',
                      additional_contact: '',
                      additional_contact_email: '',
                      additional_contact_role: '',
                    });
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Additional Communication Contact (Optional)
                </Button>
              </div>
            )}
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
  additional_contact2_name: string;
  additional_contact2_role: string;
  additional_contact2: string;
  additional_contact2_email: string;
  additional_contact_name?: string;
  additional_contact?: string;
  additional_contact_email?: string;
  additional_contact_role?: string;
}): boolean {
  // Validate first contact (Transaction - Mandatory)
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

  // Validate second contact (Additional Communication 1 - Mandatory)
  if (!data.escalation_name.trim()) {
    alert('Please enter first additional communication contact name');
    return false;
  }
  if (!data.escalation_role || !['hod', 'proprietor', 'head'].includes(data.escalation_role)) {
    alert('Please select HOD, Proprietor, or Head for first additional communication contact');
    return false;
  }
  if (!data.escalation_contact.trim() || data.escalation_contact.length !== 10) {
    alert('Please enter a valid 10-digit first additional communication contact number');
    return false;
  }
  if (!data.escalation_email.trim() || !data.escalation_email.includes('@')) {
    alert('Please enter a valid first additional communication email address');
    return false;
  }

  // Validate third contact (Additional Communication 2 - Mandatory)
  if (!data.additional_contact2_name.trim()) {
    alert('Please enter second additional communication contact name');
    return false;
  }
  if (!data.additional_contact2_role || !['hod', 'proprietor', 'head'].includes(data.additional_contact2_role)) {
    alert('Please select HOD, Proprietor, or Head for second additional communication contact');
    return false;
  }
  if (!data.additional_contact2.trim() || data.additional_contact2.length !== 10) {
    alert('Please enter a valid 10-digit second additional communication contact number');
    return false;
  }
  if (!data.additional_contact2_email.trim() || !data.additional_contact2_email.includes('@')) {
    alert('Please enter a valid second additional communication email address');
    return false;
  }

  // Validate fourth contact (Additional Communication 3 - Optional, but if any field is filled, all should be filled)
  const hasThirdContact = Boolean(
    data.additional_contact_name?.trim() ||
    data.additional_contact?.trim() ||
    data.additional_contact_email?.trim()
  );

  if (hasThirdContact) {
    if (!data.additional_contact_name?.trim()) {
      alert('Please enter name for third additional communication contact or remove all fields');
      return false;
    }
    if (!data.additional_contact?.trim() || data.additional_contact.length !== 10) {
      alert('Please enter a valid 10-digit contact number for third additional communication contact');
      return false;
    }
    if (!data.additional_contact_email?.trim() || !data.additional_contact_email.includes('@')) {
      alert('Please enter a valid email address for third additional communication contact');
      return false;
    }
  }

  return true;
}

