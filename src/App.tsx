import { useState } from 'react';
import { OnboardingPage } from '@/pages/onboarding';
import { SignupPage } from '@/pages/auth/signup';

function App() {
  // Check if user has already signed up (stored in localStorage)
  const urlParams = new URLSearchParams(window.location.search);
  const supplierId = urlParams.get('supplier');
  
  // Default to showing signup page first (hasSignedUp = false)
  // Only set to true if localStorage indicates user has already completed signup
  const getInitialSignupState = (): boolean => {
    if (supplierId) {
      const signupKey = `signup_complete_${supplierId}`;
      return localStorage.getItem(signupKey) === 'true';
    }
    // No supplier ID means show signup page (default to false)
    return false;
  };

  const [hasSignedUp, setHasSignedUp] = useState<boolean>(getInitialSignupState);

  // Always show signup page first when landing on the page (unless already signed up)
  // This is the initial page users see
  if (!hasSignedUp) {
    return <SignupPage onSignupComplete={() => {
      if (supplierId) {
        localStorage.setItem(`signup_complete_${supplierId}`, 'true');
      }
      setHasSignedUp(true);
    }} />;
  }

  // Only show onboarding page after successful signup
  return <OnboardingPage />;
}

export default App;
