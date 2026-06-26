import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { authService } from '@/services';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
    } catch {
      // Always show success for security
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <SEO title="Forgot Password" />
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-primary-950">Reset Password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email to receive a reset link</p>

        {sent ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            If an account exists with that email, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
            <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </>
  );
}
