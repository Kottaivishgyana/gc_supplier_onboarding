import { Check, Badge, CreditCard, FileText, Building2, Store, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEPS } from '@/types/onboarding';
import { useOnboardingStore } from '@/stores/onboardingStore';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  badge: Badge,
  id_card: CreditCard,
  receipt_long: FileText,
  account_balance: Building2,
  store: Store,
  send: Send,
};

export function Stepper() {
  const { currentStep } = useOnboardingStore();

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-8 bg-card p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
          Onboarding Steps
        </h3>
        <div className="grid grid-cols-[32px_1fr] gap-x-3">
          {STEPS.map((step, index) => {
            const Icon = ICONS[step.icon] || Badge;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isLast = index === STEPS.length - 1;

            return (
              <div key={step.id} className="contents">
                {/* Icon Column */}
                <div className="flex flex-col items-center">
                  {index > 0 && (
                    <div
                      className={cn(
                        'w-0.5 h-2',
                        isCompleted || isCurrent
                          ? 'bg-primary'
                          : 'bg-border'
                      )}
                    />
                  )}
                  {index === 0 && <div className="pt-1" />}
                  <div
                    className={cn(
                      'flex items-center justify-center size-8 rounded-full transition-all',
                      isCompleted &&
                        'bg-green-500 text-white shadow-sm',
                      isCurrent &&
                        'bg-primary text-white shadow-sm ring-4 ring-primary/10',
                      !isCompleted &&
                        !isCurrent &&
                        'bg-muted text-muted-foreground border border-border'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        'w-0.5 grow min-h-6',
                        isCompleted ? 'bg-green-500' : 'bg-border'
                      )}
                    />
                  )}
                </div>

                {/* Text Column */}
                <div className={cn('pb-8', index === 0 && 'pt-1.5', isLast && 'pb-0')}>
                  <p
                    className={cn(
                      'text-base leading-none transition-colors',
                      isCompleted && 'text-green-600 dark:text-green-400 font-bold',
                      isCurrent && 'text-primary font-bold',
                      !isCompleted && !isCurrent && 'text-muted-foreground font-medium'
                    )}
                  >
                    {step.title}
                  </p>
                  {(isCurrent || isCompleted) && (
                    <p
                      className={cn(
                        'text-sm mt-1',
                        isCompleted && 'text-green-500/70',
                        isCurrent && 'text-muted-foreground'
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

