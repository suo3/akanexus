import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'signIn' | 'forgotPassword';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    if (mode !== 'forgotPassword') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'forgotPassword') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: 'Error',
            description: error.message || 'Failed to send reset email. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Check your email',
            description: 'We sent you a password reset link.',
          });
          setMode('signIn');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Sign in failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'forgotPassword': return 'Reset your password';
      default: return 'Welcome back';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'forgotPassword': return "Enter your email and we'll send you a reset link";
      default: return 'Sign in to access your dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-none" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 mono-label uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} />
          RETURN_TO_BASE
        </button>

        <div className="bg-card border-2 border-border rounded-none p-8 animate-fade-up shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              {mode === 'forgotPassword' ? (
                <Mail className="w-6 h-6 text-primary" />
              ) : (
                <span className="text-primary font-bold text-xl font-mono">A</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2 uppercase tracking-tighter">
              {mode === 'forgotPassword' ? 'RECOVERY_PROTOCOL' : 'SESSION_INITIALIZER'}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label opacity-60">
              {mode === 'forgotPassword' ? 'IDENT_RECOVERY_v2.0' : 'AUTH_GATEWAY_ACCESS_v2.4'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest opacity-60 mono-label">USER_IDENTITY</Label>
              <Input
                id="email"
                type="email"
                placeholder="ID_ENCODING"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`bg-secondary/50 border-2 border-border focus:border-primary rounded-none h-11 mono-label ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-destructive font-mono">{errors.email}</p>
              )}
            </div>

            {mode !== 'forgotPassword' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest opacity-60 mono-label">ACCESS_KEY</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="KEY_ENCRYPTED"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`bg-secondary/50 border-2 border-border focus:border-primary rounded-none h-11 pr-10 mono-label ${errors.password ? 'border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-mono">{errors.password}</p>
                )}
              </div>
            )}

            {mode === 'signIn' && (
              <div className="flex justify-center pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgotPassword');
                    setErrors({});
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline mono-label"
                >
                  LOST_ACCESS_KEY?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              className="w-full rounded-none h-12 uppercase tracking-widest font-bold mono-label border-2 border-primary hover:bg-primary/90 transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'EXECUTING...' : (
                mode === 'forgotPassword' ? 'SEND_RECOVERY_KEY' : 'INITIALIZE_SESSION'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-6">
            {mode === 'forgotPassword' && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mono-label">
                IDENTITY_RETAINED?{' '}
                <button
                  onClick={() => {
                    setMode('signIn');
                    setErrors({});
                  }}
                  className="text-primary hover:underline"
                >
                  RETURN_TO_LOGIN
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
