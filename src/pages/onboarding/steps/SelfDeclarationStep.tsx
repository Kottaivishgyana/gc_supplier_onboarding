import { message } from 'antd';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function SelfDeclarationStep() {
  const { formData, updateSelfDeclaration } = useOnboardingStore();
  const { selfDeclaration, basicInfo } = formData;
  const supplierName = basicInfo.company_name || '[Supplier Name]';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Self Declaration</h1>
        <p className="text-muted-foreground">
          Please read the declaration below and confirm your agreement.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Declaration Text */}
            <div className="p-6 border rounded-lg bg-slate-50 dark:bg-slate-900 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <p className="mb-4">
                <span className="font-bold text-foreground">{supplierName}</span> hereby assure / declare to Geri Care Groups that, we will not involve in any kind of unethical practices, including the below listed activities either before/after the awarding of the order or on the completion of the administrative task in Geri Care Group:
              </p>

              <ol className="list-decimal list-outside ml-5 space-y-3">
                <li>
                  Any direct or indirect promise, offer, authorization or provision of anything of value to any of the personnel at Geri Care or their family member or relative.
                </li>
                <li>
                  Any offer of kickback, loan, fee, commission, reward or other advantage to any of the personnel at Geri Care or their family member or relative.
                </li>
                <li>
                  Any kind of contributions or donations which intend to or are designed or stipulated to influence the recipient (who is personnel of Geri Care or their relative) to act in the giver's favour.
                </li>
                <li>
                  In the event of knowledge of any of unethical practices at Geri Care, the supplier agrees to bring to the notice of the same to Geri Care by email to{' '}
                  <a href="mailto:vppurchase@gericare.in" className="text-primary underline font-medium">vppurchase@gericare.in</a>
                  {' '}&amp;{' '}
                  <a href="mailto:drlpr@gericare.in" className="text-primary underline font-medium">drlpr@gericare.in</a>
                  {' '}without any delay.
                </li>
                <li>
                  In the event of any such unethical practices being identified and proven by Geri Care against the supplier or its employees, the supplier agrees to immediate termination of the agreement and also to forego any outstanding amount payable to the supplier from entire Geri Care group without any further claims or litigation on Geri Care Group.
                </li>
              </ol>
            </div>

            {/* I Agree Checkbox */}
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-white dark:bg-slate-800">
              <Checkbox
                id="self_declaration_agreed"
                checked={selfDeclaration.self_declaration_agreed}
                onCheckedChange={(checked) =>
                  updateSelfDeclaration({ self_declaration_agreed: checked === true })
                }
                className="mt-0.5"
              />
              <Label
                htmlFor="self_declaration_agreed"
                className="text-sm font-medium cursor-pointer leading-relaxed"
              >
                I agree to the above Self Declaration on behalf of{' '}
                <span className="font-bold">{supplierName}</span>
                <span className="text-destructive"> *</span>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function validateSelfDeclaration(
  data: { self_declaration_agreed: boolean },
): boolean {
  message.destroy();

  if (!data.self_declaration_agreed) {
    message.error({ content: 'Please agree to the Self Declaration to proceed', key: 'validation-error' });
    return false;
  }
  return true;
}
