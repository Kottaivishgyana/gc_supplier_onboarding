import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { createUser, checkUserExists } from '@/services/erpnextApi';

interface SignupPageProps {
  onSignupComplete?: () => void;
}

export function SignupPage({ onSignupComplete }: SignupPageProps) {
  const { supplierData, initializeFromUrl, isLoading: storeLoading } = useOnboardingStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupComplete, setSignupComplete] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

  // Initialize supplier data from URL and check user immediately
  useEffect(() => {
    const initializeAndCheck = async () => {
      if (!supplierData) {
        await initializeFromUrl();
        // Get fresh supplierData from store after initialization
        const currentState = useOnboardingStore.getState();
        const email = currentState.supplierData?.email_id;
        
        if (email) {
          try {
            const userExists = await checkUserExists(email);
            
            if (userExists) {
              // User exists, show message with login button
              setUserAlreadyExists(true);
              setCheckingUser(false);
              return;
            }
          } catch (err) {
            console.error('Error checking user existence:', err);
          }
        }
      } else if (supplierData.email_id) {
        // Supplier data already loaded, check user immediately
        try {
          const userExists = await checkUserExists(supplierData.email_id);
          
          if (userExists) {
            // User exists, show message with login button
            setUserAlreadyExists(true);
            setCheckingUser(false);
            return;
          }
        } catch (err) {
          console.error('Error checking user existence:', err);
        }
      }
      
      setCheckingUser(false);
    };

    initializeAndCheck();
  }, [supplierData, initializeFromUrl]);

  // Handle login button click
  const handleLogin = () => {
    const loginUrl = import.meta.env.VITE_LOGIN_URL;
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      setError('Login URL is not configured. Please contact support.');
    }
  };

  // Split supplier name into first and last name
  const splitSupplierName = (name: string): { first_name: string; last_name: string } => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return { first_name: parts[0], last_name: '' };
    }
    const first_name = parts[0];
    const last_name = parts.slice(1).join(' ');
    return { first_name, last_name };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!supplierData?.email_id) {
      setError('Email address is required');
      return;
    }

    if (!supplierData?.supplier_name) {
      setError('Supplier name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const { first_name, last_name } = splitSupplierName(supplierData.supplier_name);
      
      const result = await createUser({
        email: supplierData.email_id,
        first_name,
        last_name,
        new_password: password,
        send_welcome_email: 0,
        enabled: 1,
        roles: [{ role: 'Supplier' }],
      });

      if (result.success) {
        setSignupComplete(true);
        // Call the callback to update App state
        if (onSignupComplete) {
          setTimeout(() => {
            onSignupComplete();
          }, 1500);
        } else {
          // Fallback: redirect after 2 seconds
          setTimeout(() => {
            window.location.href = window.location.pathname + window.location.search;
          }, 2000);
        }
      } else {
        setError(result.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state - show while fetching supplier data or checking user existence
  if (storeLoading || !supplierData || checkingUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-center">
              {checkingUser ? 'Checking account status...' : 'Loading your signup form...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state (no supplier data after loading)
  if (!supplierData?.email_id) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-center">Invalid Link</h2>
            <p className="text-muted-foreground text-center">
              Unable to load supplier information. Please use the link sent to your email.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User already exists state - show message with login button
  if (userAlreadyExists) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Account Already Exists</h2>
              <p className="text-muted-foreground">
                An account with the email <span className="font-semibold text-foreground">{supplierData.email_id}</span> already exists.
              </p>
              <p className="text-muted-foreground text-sm mt-4">
                Please log in to continue with your account.
              </p>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full h-14"
              size="lg"
            >
              Go to Login Page
            </Button>
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 w-full">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (signupComplete) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-center">Account Created Successfully!</h2>
            <p className="text-muted-foreground text-center">
              Redirecting to onboarding form...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
          <CardDescription className="text-center">
            Set up your password to complete the signup process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={supplierData.email_id}
                  readOnly
                  className="pr-12 h-14 bg-muted cursor-not-allowed"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-sm text-muted-foreground">
                This email is pre-filled and cannot be changed
              </p>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">
                New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12 h-14"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-12 h-14"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

