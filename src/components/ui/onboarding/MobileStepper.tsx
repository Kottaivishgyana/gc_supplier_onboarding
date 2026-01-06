import { Badge, CreditCard, FileText, Building2, Store, Send, Pill, ContactRound, Receipt } from 'lucide-react';
import { STEPS } from '@/types/onboarding';
import { useOnboardingStore } from '@/stores/onboardingStore';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  badge: Badge,
  id_card: CreditCard,
  receipt_long: FileText,
  account_balance: Building2,
  store: Store,
  medical_services: Pill,
  contact_mail: ContactRound,
  receipt: Receipt,
  send: Send,
};

export function MobileStepper() {
  const { currentStep } = useOnboardingStore();
  const currentStepConfig = STEPS.find((s) => s.id === currentStep);
  const Icon = currentStepConfig ? ICONS[currentStepConfig.icon] : Badge;

  return (
    <div className="lg:hidden mb-6 flex items-center justify-between bg-card p-4 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-bold text-foreground">
          {currentStepConfig?.title}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        Step {currentStep} of {STEPS.length}
      </span>
    </div>
  );
}

