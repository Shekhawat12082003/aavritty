import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { authService } from '@/services';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authService.register(data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Database may not be connected yet.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <p className="text-lg font-semibold text-green-600">Registration Successful!</p>
        <p className="mt-2 text-sm text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Register" />
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-primary-950">Create Account</h1>
        <p className="mt-2 text-sm text-slate-500">Join AAVRITTY for wholesale electrical products</p>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" error={errors.firstName?.message} {...register('firstName', { required: 'Required' })} />
            <Input label="Last Name" error={errors.lastName?.message} {...register('lastName', { required: 'Required' })} />
          </div>
          <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
          />
          <Button type="submit" loading={loading} className="w-full">Create Account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </>
  );
}
