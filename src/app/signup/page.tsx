'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { signupSchema, SignupInput } from '@/lib/validations';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Something went wrong');
        return;
      }

      toast.success('Account created successfully! Please sign in.');
      router.push('/login');
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden bg-primary lg:flex items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-4xl font-bold text-white">FeedbackHub</h1>
          <p className="mt-4 text-lg text-blue-100">Collect Feedback That Matters</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                sign in to your existing account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Full name"
                type="text"
                placeholder="Enter your full name"
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  error={errors.password?.message}
                  helperText="Minimum 6 characters"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                </button>
              </div>
            </div>
            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Create account
            </Button>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
