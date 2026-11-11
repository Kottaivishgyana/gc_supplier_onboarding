import { useState, useEffect } from 'react';
import { OnboardingPage } from '@/pages/onboarding';
import { SignupPage } from '@/pages/auth/signup';
import { checkOnboardingStatus } from '@/services/erpnextApi';
import type { OnboardingStatus } from '@/services/erpnextApi';
import { Loader2, Clock, ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

function getUhidFromUrl(): string | null {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return (path && !path.includes('/')) ? path : null;
}

function StatusScreen({ icon, title, message, iconBg, iconColor }: {
  icon: React.ReactNode;
  title: string;
  message: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 px-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className={`w-24 h-24 ${iconBg} rounded-full flex items-center justify-center`}>
              <div className={iconColor}>{icon}</div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-lg text-muted-foreground">{message}</p>
            </div>
            <div className="mt-6 pt-6 border-t w-full">
              <p className="text-sm text-muted-foreground">
                If you need assistance, please contact Geri Care Purchase team -{' '}
                <a href="mailto:purchasemanager@gericare.in" className="text-primary underline font-medium">purchasemanager@gericare.in</a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  const supplierId = getUhidFromUrl();
  const [linkStatus, setLinkStatus] = useState<OnboardingStatus | 'loading'>('loading');

  // Check link status before showing anything
  useEffect(() => {
    if (!supplierId) {
      setLinkStatus('invalid');
      return;
    }

    checkOnboardingStatus(supplierId)
      .then((result) => setLinkStatus(result.status))
      .catch(() => setLinkStatus('error'));
  }, [supplierId]);

  // Loading
  if (linkStatus === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expired
  if (linkStatus === 'expired') {
    return (
      <StatusScreen
        icon={<Clock className="w-16 h-16" />}
        iconBg="bg-amber-100 dark:bg-amber-900/30"
        iconColor="text-amber-600"
        title="This link has expired"
        message="For security, onboarding links are valid for 24 hours. Please contact the Geri Care Purchase Team to get a new link."
      />
    );
  }

  // Completed
  if (linkStatus === 'completed') {
    return (
      <StatusScreen
        icon={<ShieldCheck className="w-16 h-16" />}
        iconBg="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600"
        title="Already Submitted"
        message="Your vendor onboarding application has already been submitted. No further action is required."
      />
    );
  }

  // Invalid
  if (linkStatus === 'invalid') {
    return (
      <StatusScreen
        icon={<ShieldAlert className="w-16 h-16" />}
        iconBg="bg-red-100 dark:bg-red-900/30"
        iconColor="text-red-600"
        title="Invalid Link"
        message="This link is not valid. Please use the latest link from your email."
      />
    );
  }

  // Error
  if (linkStatus === 'error') {
    return (
      <StatusScreen
        icon={<AlertCircle className="w-16 h-16" />}
        iconBg="bg-red-100 dark:bg-red-900/30"
        iconColor="text-red-600"
        title="Something went wrong"
        message="Please try again later."
      />
    );
  }

  // Valid — show signup/onboarding flow
  const getInitialSignupState = (): boolean => {
    if (supplierId) {
      const signupKey = `signup_complete_${supplierId}`;
      return localStorage.getItem(signupKey) === 'true';
    }
    return false;
  };

  return <ValidFlow supplierId={supplierId} getInitialSignupState={getInitialSignupState} />;
}

function ValidFlow({ supplierId, getInitialSignupState }: { supplierId: string | null; getInitialSignupState: () => boolean }) {
  const [hasSignedUp, setHasSignedUp] = useState<boolean>(getInitialSignupState);

  if (!hasSignedUp) {
    return <SignupPage onSignupComplete={() => {
      if (supplierId) {
        localStorage.setItem(`signup_complete_${supplierId}`, 'true');
      }
      setHasSignedUp(true);
    }} />;
  }

  return <OnboardingPage />;
}

export default App;
