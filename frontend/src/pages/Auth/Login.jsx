import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { login } from '../../features/auth/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Zod Schema for validation
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, token } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Where did the user try to go before hitting the login page?
  const from = location.state?.from?.pathname || '/';

  // If already logged in, redirect away from login
  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, navigate, from]);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(login(data));
    
    // Catch rejection and fire a toast, or show success and redirect
    if (login.rejected.match(resultAction)) {
      toast.error(resultAction.payload || 'Failed to login');
    } else {
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-elevated p-8 rounded-md shadow-card border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-primary">HRMS Pro</h1>
          <p className="text-sm text-text-secondary mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={status === 'loading'}
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
